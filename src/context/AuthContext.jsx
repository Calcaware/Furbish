import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMe, login as apiLogin, register as apiRegister } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("furbish_token");
		if (!token) {
			setLoading(false);
			return;
		}
		getMe()
			.then(u => setUser(u))
			.catch(() => {
				localStorage.removeItem("furbish_token");
				localStorage.removeItem("furbish_username");
			})
			.finally(() => setLoading(false));
	}, []);

	const login = useCallback(async (username, password) => {
		const data = await apiLogin(username, password);
		localStorage.setItem("furbish_token", data.token);
		localStorage.setItem("furbish_username", data.username);
		setUser({ username: data.username, id: data.id });
		return data;
	}, []);

	const register = useCallback(async (username, password) => {
		const data = await apiRegister(username, password);
		localStorage.setItem("furbish_token", data.token);
		localStorage.setItem("furbish_username", data.username);
		setUser({ username: data.username, id: data.id });
		return data;
	}, []);

	const logout = useCallback(() => {
		localStorage.removeItem("furbish_token");
		localStorage.removeItem("furbish_username");
		setUser(null);
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
