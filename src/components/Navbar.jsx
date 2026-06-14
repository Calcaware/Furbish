import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
	const { user, logout } = useAuth();
	const location = useLocation();

	function isActive(path) {
		return location.pathname === path ? "nav-link active" : "nav-link";
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "#6f42c1" }}>
			<div className="container">
				<Link className="navbar-brand fw-bold" to="/">Furbish</Link>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="nav">
					<ul className="navbar-nav me-auto">
						<li className="nav-item">
							<Link className={isActive("/")} to="/">Translate</Link>
						</li>
						<li className="nav-item">
							<Link className={isActive("/submissions")} to="/submissions">Proposals</Link>
						</li>
					</ul>
					<ul className="navbar-nav">
						{user ? (
							<>
								<li className="nav-item">
									<span className="nav-link text-light">{user.username}</span>
								</li>
								<li className="nav-item">
									<button className="nav-link btn btn-link text-white text-decoration-none" onClick={logout}>Logout</button>
								</li>
							</>
						) : (
							<li className="nav-item">
								<Link className={isActive("/login")} to="/login">Login</Link>
							</li>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
}
