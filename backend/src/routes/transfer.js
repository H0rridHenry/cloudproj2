import express from 'express';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import auth from '../middleware/auth.js';
import Transfer from '../models/Transfer.js';

const router = express.Router();
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
		cb(null, dir);
	},
	filename: (req, file, cb) => {
		const name = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
		cb(null, name);
	}
});
const upload = multer({ storage });

router.post('/upload', auth, upload.single('file'), async (req, res) => {
	try {
		const { passkey } = req.body;
		if (!req.file || !passkey) return res.status(400).json({ message: 'File and passkey required' });
		const passkeyHash = await bcrypt.hash(passkey, 10);
		const minutes = parseInt(process.env.TRANSFER_EXPIRY_MINUTES || '60', 10);
		const expiresAt = new Date(Date.now() + minutes * 60 * 1000);
		const transfer = await Transfer.create({
			filename: req.file.originalname,
			storedPath: req.file.path,
			passkeyHash,
			expiresAt,
			owner: req.user.id
		});
		return res.json({ id: transfer._id, expiresAt });
	} catch (e) {
		return res.status(500).json({ message: 'Upload failed' });
	}
});

router.post('/download', async (req, res) => {
	try {
		const { id, passkey } = req.body;
		if (!id || !passkey) return res.status(400).json({ message: 'id and passkey required' });
		const transfer = await Transfer.findById(id);
		if (!transfer) return res.status(404).json({ message: 'Not found' });
		const ok = await bcrypt.compare(passkey, transfer.passkeyHash);
		if (!ok) return res.status(401).json({ message: 'Invalid passkey' });
		if (!fs.existsSync(transfer.storedPath)) return res.status(410).json({ message: 'File expired' });
		return res.json({ fileUrl: `/static/${path.basename(transfer.storedPath)}`, filename: transfer.filename });
	} catch (e) {
		return res.status(500).json({ message: 'Download failed' });
	}
});

export default router;


