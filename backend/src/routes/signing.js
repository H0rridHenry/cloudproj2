import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import { signFileSha256Rsa, getPublicKeyPath } from '../services/signingService.js';

const router = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads'));
	},
	filename: (req, file, cb) => {
		const name = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
		cb(null, name);
	}
});
const upload = multer({ storage });

router.post('/sign', upload.single('file'), async (req, res) => {
	try {
		if (!req.file) return res.status(400).json({ message: 'No file' });
		const sigPath = req.file.path + '.sig';
		await signFileSha256Rsa(req.file.path, sigPath);
		// Zip original + signature + public key
		const zipName = req.file.filename + '.signed.zip';
		const zipPath = path.join(path.dirname(req.file.path), zipName);
		await new Promise((resolve, reject) => {
			const output = fs.createWriteStream(zipPath);
			const archive = archiver('zip', { zlib: { level: 9 } });
			output.on('close', resolve);
			archive.on('error', reject);
			archive.pipe(output);
			archive.file(req.file.path, { name: req.file.originalname });
			archive.file(sigPath, { name: req.file.originalname + '.sig' });
			archive.file(getPublicKeyPath(), { name: 'public.pem' });
			archive.finalize();
		});
		return res.json({ fileUrl: `/static/${path.basename(zipPath)}` });
	} catch (e) {
		return res.status(500).json({ message: 'Signing failed' });
	}
});

router.get('/public-cert', (req, res) => {
	const pubPath = getPublicKeyPath();
	return res.json({ fileUrl: `/static/${path.basename(pubPath)}` });
});

export default router;


