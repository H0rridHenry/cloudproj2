import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import connectDb from './config/db.js';
import authRoutes from './routes/auth.js';
import encryptionRoutes from './routes/encryption.js';
import transferRoutes from './routes/transfer.js';
import compressionRoutes from './routes/compression.js';
import signingRoutes from './routes/signing.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ensure upload directory exists
const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// Static serve for downloaded artifacts
app.use('/static', express.static(uploadDir));

// DB
await connectDb();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/encryption', encryptionRoutes);
app.use('/api/transfer', transferRoutes);
app.use('/api/compression', compressionRoutes);
app.use('/api/signing', signingRoutes);

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok' });
});
app.get("/api/test", (req, res) => {
  res.json({ message: "Frontend successfully connected to backend!" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});


