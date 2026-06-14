const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { translate, addCommunityEntry } = require("./translator");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");

function readJSON(file) {
	try {
		return JSON.parse(fs.readFileSync(file, "utf8"));
	} catch {
		return [];
	}
}

function writeJSON(file, data) {
	fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function genToken() {
	return crypto.randomBytes(32).toString("hex");
}

function hashPassword(password) {
	const salt = crypto.randomBytes(16).toString("hex");
	const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
	return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
	const [salt, hash] = stored.split(":");
	return hash === crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

function auth(req, res, next) {
	const header = req.headers.authorization;
	if (!header || !header.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const token = header.slice(7);
	const users = readJSON(USERS_FILE);
	const user = users.find(u => u.token === token);
	if (!user) {
		return res.status(401).json({ error: "Invalid token" });
	}
	req.user = user;
	next();
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

app.post("/api/register", (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({ error: "Username and password required" });
	}
	if (username.length < 2 || password.length < 4) {
		return res.status(400).json({ error: "Username (min 2 chars) and password (min 4 chars)" });
	}
	const users = readJSON(USERS_FILE);
	if (users.find(u => u.username === username)) {
		return res.status(409).json({ error: "Username already taken" });
	}
	const token = genToken();
	const user = {
		id: users.length + 1,
		username,
		passwordHash: hashPassword(password),
		token,
		createdAt: new Date().toISOString()
	};
	users.push(user);
	writeJSON(USERS_FILE, users);
	res.json({ token, username: user.username, id: user.id });
});

app.post("/api/login", (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({ error: "Username and password required" });
	}
	const users = readJSON(USERS_FILE);
	const user = users.find(u => u.username === username);
	if (!user || !verifyPassword(password, user.passwordHash)) {
		return res.status(401).json({ error: "Invalid credentials" });
	}
	if (!user.token) {
		user.token = genToken();
		writeJSON(USERS_FILE, users);
	}
	res.json({ token: user.token, username: user.username, id: user.id });
});

app.get("/api/me", auth, (req, res) => {
	res.json({ username: req.user.username, id: req.user.id });
});

app.post("/api/translate", (req, res) => {
	const { text, direction } = req.body;
	if (!text) {
		return res.status(400).json({ error: "Text is required" });
	}
	const dir = direction === "furbish" ? "furbish" : "english";
	const result = translate(text, dir);
	res.json({ input: text, output: result, direction: dir });
});

app.get("/api/submissions", (req, res) => {
	const submissions = readJSON(SUBMISSIONS_FILE);
	const list = submissions.map(s => ({
		id: s.id,
		username: s.username,
		furbish: s.furbish,
		english: s.english,
		upvotes: s.upvotes,
		downvotes: s.downvotes,
		score: s.upvotes - s.downvotes,
		status: s.status,
		commentCount: (s.comments || []).length,
		createdAt: s.createdAt
	}));
	list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	res.json(list);
});

app.post("/api/submissions", auth, (req, res) => {
	const { furbish, english } = req.body;
	if (!furbish || !english) {
		return res.status(400).json({ error: "Furbish and English text required" });
	}
	const submissions = readJSON(SUBMISSIONS_FILE);
	const submission = {
		id: submissions.length + 1,
		userId: req.user.id,
		username: req.user.username,
		furbish: furbish.toLowerCase().trim(),
		english: english.toLowerCase().trim(),
		upvotes: 1,
		downvotes: 0,
		voters: { [req.user.id]: "up" },
		comments: [],
		status: "pending",
		createdAt: new Date().toISOString()
	};
	submissions.push(submission);
	writeJSON(SUBMISSIONS_FILE, submissions);
	res.json(submission);
});

app.get("/api/submissions/:id", (req, res) => {
	const submissions = readJSON(SUBMISSIONS_FILE);
	const s = submissions.find(x => x.id === parseInt(req.params.id));
	if (!s) return res.status(404).json({ error: "Not found" });
	res.json(s);
});

app.post("/api/submissions/:id/vote", auth, (req, res) => {
	const { vote } = req.body;
	if (vote !== "up" && vote !== "down") {
		return res.status(400).json({ error: "Vote must be 'up' or 'down'" });
	}
	const submissions = readJSON(SUBMISSIONS_FILE);
	const s = submissions.find(x => x.id === parseInt(req.params.id));
	if (!s) return res.status(404).json({ error: "Not found" });
	if (s.userId === req.user.id) {
		return res.status(400).json({ error: "Cannot vote on your own submission" });
	}

	const prev = s.voters[req.user.id];
	if (prev === vote) {
		return res.json({ message: "Vote unchanged", submission: s });
	}

	if (prev === "up") s.upvotes--;
	if (prev === "down") s.downvotes--;

	s.voters[req.user.id] = vote;
	if (vote === "up") s.upvotes++;
	if (vote === "down") s.downvotes++;

	const score = s.upvotes - s.downvotes;
	if (score >= 10 && s.status === "pending") {
		s.status = "accepted";
		addCommunityEntry(s.furbish, s.english);
	}

	writeJSON(SUBMISSIONS_FILE, submissions);
	res.json({ message: "Vote recorded", submission: s });
});

app.post("/api/submissions/:id/comments", auth, (req, res) => {
	const { text } = req.body;
	if (!text || !text.trim()) {
		return res.status(400).json({ error: "Comment text required" });
	}
	const submissions = readJSON(SUBMISSIONS_FILE);
	const s = submissions.find(x => x.id === parseInt(req.params.id));
	if (!s) return res.status(404).json({ error: "Not found" });
	const comment = {
		id: s.comments.length + 1,
		userId: req.user.id,
		username: req.user.username,
		text: text.trim(),
		createdAt: new Date().toISOString()
	};
	s.comments.push(comment);
	writeJSON(SUBMISSIONS_FILE, submissions);
	res.json(comment);
});

const dist = path.join(__dirname, "dist");
app.get("*", (req, res) => {
	res.sendFile(path.join(dist, "index.html"));
});

app.listen(PORT, () => {
	console.log(`Furbish Translator running at http://localhost:${PORT}`);
});
