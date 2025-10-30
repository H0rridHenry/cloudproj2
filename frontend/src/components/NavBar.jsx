export default function NavBar() {
	return (
		<nav className="bg-white border-b border-gray-200">
			<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
				<div className="text-xl font-semibold">Secure Cloud</div>
				<div className="space-x-3">
					<button
						className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200"
						onClick={() => {
							localStorage.removeItem('token');
							window.location.href = '/login';
						}}
					>
						Logout
					</button>
				</div>
			</div>
		</nav>
	);
}


