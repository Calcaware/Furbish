import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSubmissions, createSubmission, vote, getSubmission, comment } from "../api";
import SubmissionCard from "./SubmissionCard";

export default function Submissions() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [submissions, setSubmissions] = useState([]);

	const [showForm, setShowForm] = useState(false);
	const [furbish, setFurbish] = useState("");
	const [english, setEnglish] = useState("");
	const [formError, setFormError] = useState("");

	const [commentsId, setCommentsId] = useState(null);
	const [comments, setComments] = useState([]);
	const [commentText, setCommentText] = useState("");
	const [commentError, setCommentError] = useState("");

	useEffect(() => { load(); }, []);

	async function load() {
		const list = await getSubmissions();
		setSubmissions(list);
	}

	async function handleVote(id, dir) {
		if (!user) { navigate("/login"); return; }
		try {
			await vote(id, dir);
			load();
		} catch (err) {
			alert(err.message);
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setFormError("");
		try {
			await createSubmission(furbish, english);
			setFurbish("");
			setEnglish("");
			setShowForm(false);
			load();
		} catch (err) {
			setFormError(err.message);
		}
	}

	async function openComments(id) {
		const s = await getSubmission(id);
		setCommentsId(id);
		setComments(s.comments || []);
	}

	async function handleComment(e) {
		e.preventDefault();
		setCommentError("");
		try {
			await comment(commentsId, commentText);
			setCommentText("");
			const s = await getSubmission(commentsId);
			setComments(s.comments || []);
		} catch (err) {
			setCommentError(err.message);
		}
	}

	return (
		<main className="container py-5">
			<div className="row justify-content-center">
				<div className="col-lg-8">
					<div className="d-flex justify-content-between align-items-center mb-4">
						<h2 className="mb-0" style={{ color: "#6f42c1" }}>Translation Proposals</h2>
						<button className="btn btn-primary"
							style={{ background: "#6f42c1", borderColor: "#6f42c1" }}
							onClick={() => setShowForm(!showForm)}>
							{showForm ? "Cancel" : "+ New Proposal"}
						</button>
					</div>

					{showForm && (
						<div className="card mb-4 shadow-sm">
							<div className="card-body">
								<form onSubmit={handleSubmit}>
									<div className="mb-3">
										<label className="form-label">Furbish</label>
										<input type="text" className="form-control" required placeholder="e.g. dah a-loh"
											value={furbish} onChange={e => setFurbish(e.target.value)} />
									</div>
									<div className="mb-3">
										<label className="form-label">English meaning</label>
										<input type="text" className="form-control" required placeholder="e.g. sun"
											value={english} onChange={e => setEnglish(e.target.value)} />
									</div>
									{formError && <div className="alert alert-danger">{formError}</div>}
									<button type="submit" className="btn btn-primary"
										style={{ background: "#6f42c1", borderColor: "#6f42c1" }}>Submit</button>
								</form>
							</div>
						</div>
					)}

					{submissions.length === 0 ? (
						<div className="text-center text-muted py-5">
							<p className="fs-5">No proposals yet.</p>
							<p>Be the first to suggest a translation!</p>
						</div>
					) : (
						submissions.map(s => (
							<SubmissionCard key={s.id} submission={s}
								onVote={handleVote}
								onComments={openComments} />
						))
					)}
				</div>
			</div>

			{commentsId !== null && (
				<div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Comments</h5>
								<button type="button" className="btn-close" onClick={() => setCommentsId(null)}></button>
							</div>
							<div className="modal-body">
								{comments.length === 0
									? <p className="text-muted">No comments yet.</p>
									: comments.map(c => (
										<div key={c.id} className="mb-2 pb-2 border-bottom">
											<strong>{c.username}</strong>
											<span className="text-muted small"> {new Date(c.createdAt).toLocaleDateString()}</span>
											<br />{c.text}
										</div>
									))
								}
								<hr />
								<form onSubmit={handleComment}>
									<div className="mb-2">
										<textarea className="form-control" rows="2" placeholder="Add a comment..."
											value={commentText} onChange={e => setCommentText(e.target.value)} required />
									</div>
									{commentError && <div className="alert alert-danger">{commentError}</div>}
									<button type="submit" className="btn btn-primary btn-sm"
										style={{ background: "#6f42c1", borderColor: "#6f42c1" }}>Post Comment</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
