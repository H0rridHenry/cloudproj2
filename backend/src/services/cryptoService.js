import crypto from 'crypto';
import fs from 'fs';

export function generateAesKey() {
	const key = crypto.randomBytes(32); // AES-256
	const iv = crypto.randomBytes(16);
	return { key, iv };
}

export function encryptFileAes256Cbc(inputPath, outputPath, key, iv) {
	const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
	return new Promise((resolve, reject) => {
		const input = fs.createReadStream(inputPath);
		const output = fs.createWriteStream(outputPath);
		input.pipe(cipher).pipe(output);
		output.on('finish', resolve);
		output.on('error', reject);
	});
}

export function decryptFileAes256Cbc(inputPath, outputPath, key, iv) {
	const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
	return new Promise((resolve, reject) => {
		const input = fs.createReadStream(inputPath);
		const output = fs.createWriteStream(outputPath);
		input.pipe(decipher).pipe(output);
		output.on('finish', resolve);
		output.on('error', reject);
	});
}


