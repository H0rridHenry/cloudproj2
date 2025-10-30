import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
	try {
		const exists = await User.findOne({ email });
		if (exists) return res.status(409).json({ message: 'Email already in use' });
		const passwordHash = await bcrypt.hash(password, 12);
		const user = await User.create({ name, email, passwordHash });
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
		return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
	} catch (e) {
		return res.status(500).json({ message: 'Server error' });
	}
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
		return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
	} catch (e) {
		return res.status(500).json({ message: 'Server error' });
	}
});

export default router;


