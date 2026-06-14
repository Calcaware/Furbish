import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Translate from "./components/Translate";
import Login from "./components/Login";
import Submissions from "./components/Submissions";
import { useAuth } from "./context/AuthContext";

export default function App() {
	const { loading } = useAuth();

	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items-center vh-100">
				<div className="spinner-border" style={{ color: "#6f42c1" }} />
			</div>
		);
	}

	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/" element={<Translate />} />
				<Route path="/login" element={<Login />} />
				<Route path="/submissions" element={<Submissions />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
			<footer className="border-top py-3 text-center text-muted small">
				<div className="container">
					Inspired by <a href="https://www.reddit.com/r/furby/" target="_blank" rel="noopener">r/furby</a>
					&middot; MIT License
				</div>
			</footer>
		</>
	);
}
