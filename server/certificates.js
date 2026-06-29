import express from "express";
import sql from "./db.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// 1. Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'certificates', // The folder name inside your Cloudinary dashboard
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    },
});

const upload = multer({ storage: storage });

// GET: Fetch all entries
router.get('/', async (req, res) => {
    try {
        const certificates = await sql`SELECT * FROM certificates ORDER BY date_earned DESC`;
        res.json({ success: true, data: certificates });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
});

// POST: Add new certificate (With upload.single('image') middleware)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, issuer, date_earned, description } = req.body;

        // If a file was uploaded, grab its Cloudinary secure_url link
        const image_url = req.file ? req.file.path : '';

        await sql`
            INSERT INTO certificates (title, issuer, date_earned, image_url, description)
            VALUES (${title}, ${issuer}, ${date_earned}, ${image_url}, ${description || ''})
        `;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT: Edit existing certificate
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, issuer, date_earned, description } = req.body;

        // If a new image was uploaded, use it. Otherwise, look for an existing URL string passed back
        let image_url = req.file ? req.file.path : req.body.image_url;

        await sql`
            UPDATE certificates
            SET title = ${title}, issuer = ${issuer}, date_earned = ${date_earned}, image_url = ${image_url}, description = ${description || ''}
            WHERE id = ${req.params.id}
        `;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE: Remove by ID
router.delete('/:id', async (req, res) => {
    try {
        await sql`DELETE FROM certificates WHERE id = ${req.params.id}`;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;