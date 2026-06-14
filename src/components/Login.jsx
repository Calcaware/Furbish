import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
	const { user, login, register } = useAuth();
	const navigate = useNavigate();
	const [tab, setTab] = useState("login");

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	if (user) {
		return (
			<main className="container py-5">
				<div className="row justify-content-center">
					<div className="col-md-6 col-lg-5">
						<div className="alert alert-success text-center">
							Logged in as <strong>{user.username}</strong>.
						</div>
					</div>
				</div>
			</main>
		);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		try {
			if (tab === "login") {
				await login(username, password);
			} else {
				await register(username, password);
			}
			navigate("/");
		} catch (err) {
			setError(err.message);
		}
	}

	return (
		<main className="container py-5">
			<div className="row justify-content-center">
				<div className="col-md-6 col-lg-5">
					<h2 className="text-center mb-4" style={{ color: "#6f42c1" }}>Welcome</h2>

					<ul className="nav nav-tabs mb-4">
						<li className="nav-item">
							<button className={"nav-link" + (tab === "login" ? " active" : "")}
								onClick={() => setTab("login")}>Log In</button>
						</li>
						<li className="nav-item">
							<button className={"nav-link" + (tab === "register" ? " active" : "")}
								onClick={() => setTab("register")}>Register</button>
						</li>
					</ul>

					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label className="form-label">Username</label>
							<input type="text" className="form-control" required
								value={username} onChange={e => setUsername(e.target.value)} />
							{tab === "register" && <div className="form-text">At least 2 characters.</div>}
						</div>
						<div className="mb-3">
							<label className="form-label">Password</label>
							<input type="password" className="form-control" required
								value={password} onChange={e => setPassword(e.target.value)} />
							{tab === "register" && <div className="form-text">At least 4 characters.</div>}
						</div>
						{error && <div className="alert alert-danger">{error}</div>}
						<button type="submit" className={"btn w-100" + (tab === "register" ? " btn-success" : " btn-primary")}
							style={tab === "login" ? { background: "#6f42c1", borderColor: "#6f42c1" } : {}}>
							{tab === "login" ? "Log In" : "Create Account"}
						</button>
					</form>
				</div>
			</div>
		</main>
	);
}
