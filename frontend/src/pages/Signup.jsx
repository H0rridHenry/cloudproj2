import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';

export default function Signup() {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const onSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			const { data } = await api.post('/auth/signup', { name, email, password });
			localStorage.setItem('token', data.token);
			navigate('/');
		} catch (e) {
			setError(e?.response?.data?.message || 'Signup failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-md bg-white shadow rounded-lg p-6">
				<h1 className="text-2xl font-semibold mb-4">Create account</h1>
				<form onSubmit={onSubmit} className="space-y-4">
					<input className="w-full border rounded px-3 py-2" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
					<input className="w-full border rounded px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					<input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
					{error && <div className="text-red-600 text-sm">{error}</div>}
					<button disabled={loading} className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-60">{loading ? 'Creating...' : 'Sign up'}</button>
				</form>
				<div className="text-sm mt-4">Have an account? <Link className="text-blue-600" to="/login">Login</Link></div>
			</div>
		</div>
	);
}


