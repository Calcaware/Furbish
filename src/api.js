const BASE = "";

function getToken() {
	return localStorage.getItem("furbish_token");
}

async function request(url, options = {}) {
	const token = getToken();
	const headers = { "Content-Type": "application/json", ...options.headers };
	if (token) {
		headers["Authorization"] = "Bearer " + token;
	}
	const res = await fetch(BASE + url, { ...options, headers });
	const data = await res.json();
	if (!res.ok) throw new Error(data.error || "Request failed");
	return data;
}

export function translate(text, direction) {
	return request("/api/translate", {
		method: "POST",
		body: JSON.stringify({ text, direction })
	});
}

export function login(username, password) {
	return request("/api/login", {
		method: "POST",
		body: JSON.stringify({ username, password })
	});
}

export function register(username, password) {
	return request("/api/register", {
		method: "POST",
		body: JSON.stringify({ username, password })
	});
}

export function getMe() {
	return request("/api/me");
}

export function getSubmissions() {
	return request("/api/submissions");
}

export function getSubmission(id) {
	return request("/api/submissions/" + id);
}

export function createSubmission(furbish, english) {
	return request("/api/submissions", {
		method: "POST",
		body: JSON.stringify({ furbish, english })
	});
}

export function vote(id, vote) {
	return request("/api/submissions/" + id + "/vote", {
		method: "POST",
		body: JSON.stringify({ vote })
	});
}

export function comment(id, text) {
	return request("/api/submissions/" + id + "/comments", {
		method: "POST",
		body: JSON.stringify({ text })
	});
}
