import { getDb } from '../../lib/db';
import nodemailer from 'nodemailer';
import { rateLimit } from '../../lib/rateLimit';

const contactRateLimit = rateLimit({ windowMs: 60_000, max: 5 });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
        if (!contactRateLimit(ip)) {
            return res.status(429).json({ error: 'Too many requests. Please wait before submitting again.' });
        }

        // Support both new (fullName) and legacy (firstName+lastName) field names
        const { firstName, lastName, fullName, email, phone, message, serviceType } = req.body;

        const name = (fullName || `${firstName || ''} ${lastName || ''}`.trim()).slice(0, 200);
        const safeEmail = (email || '').slice(0, 254);
        const safePhone = (phone || '').slice(0, 30);
        const safeMessage = (message || '').slice(0, 5000);
        const safeServiceType = (serviceType || '').slice(0, 200);

        if (!name || !safeEmail || !safeMessage || !safeServiceType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(safeEmail)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        try {
            console.log('Getting database connection...');
            const db = await getDb();
            console.log('Database connected successfully');

            console.log('Inserting message into database...', { name, email, phone, serviceType });

            await db.execute({
                sql: 'INSERT INTO messages (name, full_name, email, phone, message, service_type) VALUES (?, ?, ?, ?, ?, ?)',
                args: [name, name, safeEmail, safePhone, safeMessage, safeServiceType]
            });

            console.log('Message saved to database successfully');

            // Send email notification
            try {
                const transporter = nodemailer.createTransport({
                    host: 'smtpout.secureserver.net',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    },
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
                    subject: `New Contact Message - J&R NW Construction`,
                    text: `
New contact message received:

Name: ${name}
Email: ${safeEmail}
Phone: ${safePhone || 'Not provided'}
Service Type: ${safeServiceType || 'Not specified'}

Message:
${safeMessage}

---
This message was sent from the contact form at jandrnw.com
Date: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}
                    `,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                            <div style="background-color: #1a252f; padding: 20px; text-align: center;">
                                <h1 style="color: #D4AF37; margin: 0;">J&R NW Construction</h1>
                            </div>
                            <div style="background-color: white; padding: 30px; margin-top: 20px; border-radius: 5px;">
                                <h2 style="color: #1a252f; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
                                    New Contact Message
                                </h2>
                                <div style="margin: 20px 0;">
                                    <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
                                    <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
                                    <p style="margin: 10px 0;"><strong>Phone:</strong> ${safePhone || 'Not provided'}</p>
                                    <p style="margin: 10px 0;"><strong>Service Type:</strong> ${safeServiceType || 'Not specified'}</p>
                                </div>
                                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #D4AF37; margin: 20px 0;">
                                    <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
                                    <p style="margin: 0; white-space: pre-wrap;">${safeMessage}</p>
                                </div>
                                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                                <p style="color: #666; font-size: 12px; margin: 0;">
                                    This message was sent from the contact form at <a href="https://jandrnw.com">jandrnw.com</a><br>
                                    Date: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}
                                </p>
                            </div>
                        </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log('✅ Email sent successfully to:', process.env.EMAIL_TO || process.env.EMAIL_USER);
            } catch (emailError) {
                console.error('❌ Error sending email:', emailError.message);
            }

            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Contact form error:', error);
            res.status(500).json({ error: 'Failed to submit message. Please try again.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
