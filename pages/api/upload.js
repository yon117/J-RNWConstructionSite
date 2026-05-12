import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Auto-compress uploaded image in-place using sharp (if available)
async function compressUpload(filepath) {
    try {
        const sharp = (await import('sharp')).default;
        const ext = path.extname(filepath).toLowerCase();
        const tmp = filepath + '.tmp';
        let pipeline = sharp(filepath);
        const meta = await pipeline.metadata();
        if ((meta.width || 0) > 1600 || (meta.height || 0) > 1600) {
            pipeline = pipeline.resize(1600, 1600, { fit: 'inside', withoutEnlargement: true });
        }
        if (ext === '.jpg' || ext === '.jpeg') pipeline = pipeline.jpeg({ quality: 82, progressive: true, mozjpeg: true });
        else if (ext === '.png') pipeline = pipeline.png({ compressionLevel: 8 });
        else if (ext === '.webp') pipeline = pipeline.webp({ quality: 82 });
        else return; // skip unsupported formats
        await pipeline.toFile(tmp);
        const orig = fs.statSync(filepath).size;
        const compressed = fs.statSync(tmp).size;
        if (compressed < orig) {
            fs.renameSync(tmp, filepath);
            console.log(`[compress] ${path.basename(filepath)}: ${Math.round(orig/1024)}KB → ${Math.round(compressed/1024)}KB`);
        } else {
            fs.unlinkSync(tmp);
        }
    } catch (e) {
        console.warn('[compress] skipped:', e.message);
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};

// Configure Cloudinary if credentials are available
const useCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

if (useCloudinary) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const form = formidable({
            maxFileSize: 50 * 1024 * 1024, // 50MB max
            keepExtensions: true,
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Form parse error:', err);
                return res.status(500).json({
                    error: 'Error parsing form',
                    details: err.message
                });
            }

            try {
                const file = files.file?.[0] || files.file;

                if (!file) {
                    console.error('No file provided in request');
                    return res.status(400).json({ error: 'No file provided' });
                }

                console.log('Uploading file:', {
                    name: file.originalFilename,
                    size: file.size,
                    type: file.mimetype,
                    storage: useCloudinary ? 'cloudinary' : 'local'
                });

                // Validate file type - check mimetype AND extension (HEIC from iPhone can come as application/octet-stream)
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif'];
                const fileExt = path.extname(file.originalFilename || '').toLowerCase();
                const isValidType = allowedTypes.includes(file.mimetype?.toLowerCase()) || allowedExtensions.includes(fileExt);
                if (!isValidType) {
                    console.error('Invalid file type:', file.mimetype, 'ext:', fileExt);
                    return res.status(400).json({
                        error: 'Invalid file type',
                        details: `File type ${file.mimetype} (${fileExt}) not allowed. Use JPEG, PNG, WebP, GIF, or HEIC.`
                    });
                }


                // Validate file size
                if (file.size > 50 * 1024 * 1024) {
                    console.error('File too large:', file.size);
                    return res.status(400).json({
                        error: 'File too large',
                        details: 'Maximum file size is 50MB'
                    });
                }

                if (useCloudinary) {
                    // Upload to Cloudinary
                    console.log('Starting Cloudinary upload...');
                    const result = await cloudinary.uploader.upload(file.filepath, {
                        folder: 'jandr-construction',
                        resource_type: 'auto',
                        transformation: [
                            { width: 1200, height: 800, crop: 'limit' },
                            { quality: 'auto:good' }
                        ],
                        timeout: 120000
                    });

                    console.log('Upload successful:', result.public_id);

                    // Clean up temp file
                    try {
                        fs.unlinkSync(file.filepath);
                    } catch (cleanupError) {
                        console.warn('Failed to clean up temp file:', cleanupError);
                    }

                    res.status(200).json({
                        imageUrl: result.secure_url,
                        publicId: result.public_id
                    });
                } else {
                    // Upload to local storage
                    console.log('Starting local file upload...');

                    // Create uploads directory if it doesn't exist
                    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir, { recursive: true });
                    }

                    // Generate unique filename
                    const timestamp = Date.now();
                    const ext = path.extname(file.originalFilename);
                    const basename = path.basename(file.originalFilename, ext).replace(/[^a-zA-Z0-9]/g, '-');
                    const filename = `${basename}-${timestamp}${ext}`;
                    const filepath = path.join(uploadsDir, filename);

                    // Copy file to uploads directory
                    fs.copyFileSync(file.filepath, filepath);

                    // Auto-compress in background (non-blocking)
                    compressUpload(filepath);

                    // Clean up temp file
                    try {
                        fs.unlinkSync(file.filepath);
                    } catch (cleanupError) {
                        console.warn('Failed to clean up temp file:', cleanupError);
                    }

                    const imageUrl = `/uploads/${filename}`;
                    console.log('Upload successful:', imageUrl);

                    res.status(200).json({
                        imageUrl: imageUrl,
                        publicId: filename
                    });
                }
            } catch (error) {
                console.error('Upload error:', {
                    message: error.message,
                    stack: error.stack,
                    code: error.code
                });

                res.status(500).json({
                    error: 'Failed to upload image',
                    details: error.message,
                    code: error.code || 'UNKNOWN_ERROR'
                });
            }
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
