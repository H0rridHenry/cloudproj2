import express from 'express';
import multer from 'multer';
import path from 'path';
import { gzipFile, lossyImageCompress } from '../services/compressionService.js';

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

router.post('/lossless', upload.single('file'), async (req, res) => {
	try {
		if (!req.file) return res.status(400).json({ message: 'No file' });
		const out = req.file.path + '.gz';
		await gzipFile(req.file.path, out);
		return res.json({ fileUrl: `/static/${path.basename(out)}` });
	} catch (e) {
		return res.status(500).json({ message: 'Compression failed' });
	}
});

router.post('/lossy-image', upload.single('file'), async (req, res) => {
	try {
		if (!req.file) return res.status(400).json({ message: 'No file' });
		const quality = Math.min(95, Math.max(10, parseInt(req.body.quality || '70', 10)));
		const out = req.file.path + '.jpg';
		await lossyImageCompress(req.file.path, out, quality);
		return res.json({ fileUrl: `/static/${path.basename(out)}` });
	} catch (e) {
		return res.status(500).json({ message: 'Compression failed' });
	}
});

export default router;


