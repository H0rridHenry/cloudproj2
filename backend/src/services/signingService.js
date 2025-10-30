import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const keysDir = path.resolve(process.cwd(), 'keys');
function ensureKeys() {
	if (!fs.existsSync(keysDir)) fs.mkdirSync(keysDir, { recursive: true });
	const privPath = path.join(keysDir, 'private.pem');
	const pubPath = path.join(keysDir, 'public.pem');
	if (!fs.existsSync(privPath) || !fs.existsSync(pubPath)) {
		const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
			modulusLength: 2048,
			publicKeyEncoding: { type: 'spki', format: 'pem' },
			privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
		});
		fs.writeFileSync(privPath, privateKey);
		fs.writeFileSync(pubPath, publicKey);
	}
	return { privPath, pubPath };
}

export function getPublicKeyPath() {
	return ensureKeys().pubPath;
}

export function signFileSha256Rsa(inputPath, signatureOutputPath) {
	const { privPath } = ensureKeys();
	const privateKey = fs.readFileSync(privPath, 'utf-8');
	const sign = crypto.createSign('RSA-SHA256');
	const input = fs.createReadStream(inputPath);
	return new Promise((resolve, reject) => {
		input.on('data', (chunk) => sign.update(chunk));
		input.on('end', () => {
			const signature = sign.sign(privateKey);
			fs.writeFileSync(signatureOutputPath, signature);
			resolve();
		});
		input.on('error', reject);
	});
}


