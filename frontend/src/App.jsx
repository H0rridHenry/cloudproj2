import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';

function isAuthed() {
	return Boolean(localStorage.getItem('token'));
}

function ProtectedRoute({ children }) {
	if (!isAuthed()) return <Navigate to="/login" replace />;
	return children;
}

export default function App() {
	return (
		<div className="min-h-screen">
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<Navigate to={isAuthed() ? '/' : '/login'} replace />} />
			</Routes>
		</div>
	);
}


