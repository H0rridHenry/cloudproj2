import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import auth from '../middleware/auth.js';
import { generateAesKey, encryptFileAes256Cbc, decryptFileAes256Cbc } from '../services/cryptoService.js';

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

router.post('/encrypt', auth, upload.single('file'), async (req, res) => {
	try {
		if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
		const { key, iv } = generateAesKey();
		const encryptedPath = req.file.path + '.enc';
		await encryptFileAes256Cbc(req.file.path, encryptedPath, key, iv);
		// Return encrypted file for download and base64-encoded key+iv
		const keyB64 = key.toString('base64');
		const ivB64 = iv.toString('base64');
		return res.json({
			fileUrl: `/static/${path.basename(encryptedPath)}`,
			key: keyB64,
			iv: ivB64
		});
	} catch (e) {
		return res.status(500).json({ message: 'Encryption failed' });
	}
});

router.post('/decrypt', auth, upload.single('file'), async (req, res) => {
	try {
		const { key, iv } = req.body;
		if (!req.file || !key || !iv) return res.status(400).json({ message: 'File, key and iv required' });
		const keyBuf = Buffer.from(key, 'base64');
		const ivBuf = Buffer.from(iv, 'base64');
		const decryptedPath = req.file.path.replace(/\.enc$/, '') || req.file.path + '.dec';
		await decryptFileAes256Cbc(req.file.path, decryptedPath, keyBuf, ivBuf);
		return res.json({ fileUrl: `/static/${path.basename(decryptedPath)}` });
	} catch (e) {
		return res.status(500).json({ message: 'Decryption failed' });
	}
});

export default router;


