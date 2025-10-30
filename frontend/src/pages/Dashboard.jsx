import { useState } from 'react';
import NavBar from '../components/NavBar.jsx';
import api from '../lib/api.js';

export default function Dashboard() {
	return (
		<div>
			<NavBar />
			<main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
				<h1 className="text-2xl font-semibold">Dashboard</h1>
				<div className="grid md:grid-cols-2 gap-6">
					<EncryptCard />
					<TransferCard />
					<CompressionCard />
					<SigningCard />
				</div>
			</main>
		</div>
	);
}

function Card({ title, children }) {
	return (
		<div className="bg-white rounded-lg shadow p-4 border border-gray-200">
			<div className="font-semibold mb-3">{title}</div>
			{children}
		</div>
	);
}

function FileInput({ onFile }) {
	return (
		<input type="file" onChange={(e) => onFile(e.target.files?.[0] || null)} />
	);
}

function DownloadLink({ url, label = 'Download' }) {
	if (!url) return null;
	const full = url.startsWith('http') ? url : `${import.meta.env.VITE_API_FILE_BASE || 'http://localhost:5000'}${url}`;
	return (
		<a className="text-blue-600 underline" href={full} target="_blank" rel="noreferrer">{label}</a>
	);
}

function EncryptCard() {
	const [file, setFile] = useState(null);
	const [encUrl, setEncUrl] = useState('');
	const [key, setKey] = useState('');
	const [iv, setIv] = useState('');
	const [loading, setLoading] = useState(false);

	const onEncrypt = async () => {
		if (!file) return;
		setLoading(true);
		const form = new FormData();
		form.append('file', file);
		try {
			const { data } = await api.post('/encryption/encrypt', form);
			setEncUrl(data.fileUrl);
			setKey(data.key);
			setIv(data.iv);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card title="File Encryption (AES)">
			<div className="space-y-3">
				<FileInput onFile={setFile} />
				<button className="px-3 py-1.5 bg-blue-600 text-white rounded" onClick={onEncrypt} disabled={!file || loading}>{loading ? 'Encrypting...' : 'Encrypt'}</button>
				{encUrl && (
					<div className="space-y-2 text-sm">
						<div><b>Encrypted:</b> <DownloadLink url={encUrl} /></div>
						<div className="break-all"><b>Key:</b> {key}</div>
						<div className="break-all"><b>IV:</b> {iv}</div>
					</div>
				)}
			</div>
		</Card>
	);
}

function TransferCard() {
	const [file, setFile] = useState(null);
	const [passkey, setPasskey] = useState('');
	const [transferId, setTransferId] = useState('');
	const [downloadUrl, setDownloadUrl] = useState('');

	const upload = async () => {
		if (!file || !passkey) return;
		const form = new FormData();
		form.append('file', file);
		form.append('passkey', passkey);
		const { data } = await api.post('/transfer/upload', form);
		setTransferId(data.id);
	};

	const download = async () => {
		if (!transferId || !passkey) return;
		const { data } = await api.post('/transfer/download', { id: transferId, passkey });
		setDownloadUrl(data.fileUrl);
	};

	return (
		<Card title="Secure File Transfer">
			<div className="space-y-2">
				<FileInput onFile={setFile} />
				<input className="border rounded px-2 py-1 w-full" placeholder="Passkey" value={passkey} onChange={(e) => setPasskey(e.target.value)} />
				<div className="flex gap-2">
					<button className="px-3 py-1.5 bg-blue-600 text-white rounded" onClick={upload}>Upload</button>
					<button className="px-3 py-1.5 bg-gray-800 text-white rounded" onClick={download} disabled={!transferId}>Get Download</button>
				</div>
				{transferId && <div className="text-sm">Transfer ID: <span className="font-mono">{transferId}</span></div>}
				<DownloadLink url={downloadUrl} />
			</div>
		</Card>
	);
}

function CompressionCard() {
	const [file, setFile] = useState(null);
	const [losslessUrl, setLosslessUrl] = useState('');
	const [lossyUrl, setLossyUrl] = useState('');
	const [quality, setQuality] = useState(70);

	const doLossless = async () => {
		if (!file) return;
		const form = new FormData();
		form.append('file', file);
		const { data } = await api.post('/compression/lossless', form);
		setLosslessUrl(data.fileUrl);
	};

	const doLossy = async () => {
		if (!file) return;
		const form = new FormData();
		form.append('file', file);
		form.append('quality', String(quality));
		const { data } = await api.post('/compression/lossy-image', form);
		setLossyUrl(data.fileUrl);
	};

	return (
		<Card title="File Compression">
			<div className="space-y-3">
				<FileInput onFile={setFile} />
				<div className="flex gap-2">
					<button className="px-3 py-1.5 bg-blue-600 text-white rounded" onClick={doLossless}>Lossless (gzip)</button>
					<div className="flex items-center gap-2">
						<input className="border rounded px-2 py-1 w-20" type="number" min={10} max={95} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
						<button className="px-3 py-1.5 bg-gray-800 text-white rounded" onClick={doLossy}>Lossy (image)</button>
					</div>
				</div>
				<div className="text-sm space-y-1">
					<DownloadLink url={losslessUrl} label="Download lossless" />
					<DownloadLink url={lossyUrl} label="Download lossy" />
				</div>
			</div>
		</Card>
	);
}

function SigningCard() {
	const [file, setFile] = useState(null);
	const [zipUrl, setZipUrl] = useState('');
	const sign = async () => {
		if (!file) return;
		const form = new FormData();
		form.append('file', file);
		const { data } = await api.post('/signing/sign', form);
		setZipUrl(data.fileUrl);
	};
	return (
		<Card title="Digital Signing (RSA)">
			<div className="space-y-3">
				<FileInput onFile={setFile} />
				<button className="px-3 py-1.5 bg-blue-600 text-white rounded" onClick={sign}>Sign</button>
				<DownloadLink url={zipUrl} label="Download signed zip" />
			</div>
		</Card>
	);
}


