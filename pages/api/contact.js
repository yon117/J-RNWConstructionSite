import { getDb } from '../../lib/db';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Support both new (fullName) and legacy (firstName+lastName) field names
        const { firstName, lastName, fullName, email, phone, message, serviceType } = req.body;

        const name = fullName || `${firstName || ''} ${lastName || ''}`.trim();

        if (!name || !email || !message || !serviceType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            console.log('Getting database connection...');
            const db = await getDb();
            console.log('Database connected successfully');

            console.log('Inserting message into database...', { name, email, phone, serviceType });

            // Save to database — use full_name column, no budget
            await db.execute({
                sql: 'INSERT INTO messages (name, full_name, email, phone, message, service_type) VALUES (?, ?, ?, ?, ?, ?)',
                args: [name, name, email, phone || '', message, serviceType || '']
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
                    tls: { rejectUnauthorized: false }
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
                    subject: `New Contact Message - J&R NW Construction`,
                    text: `
New contact message received:

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Service Type: ${serviceType || 'Not specified'}

Message:
${message}

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
                                    <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                                    <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                                    <p style="margin: 10px 0;"><strong>Service Type:</strong> ${serviceType || 'Not specified'}</p>
                                </div>
                                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #D4AF37; margin: 20px 0;">
                                    <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
                                    <p style="margin: 0; white-space: pre-wrap;">${message}</p>
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
            res.status(500).json({
                error: 'Database error',
                details: error.message
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
