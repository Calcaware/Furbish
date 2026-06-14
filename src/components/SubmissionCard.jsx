export default function SubmissionCard({ submission, onVote, onComments }) {
	const s = submission;
	const statusBadge = s.status === "accepted"
		? '<span class="badge bg-success">Accepted</span>'
		: '<span class="badge bg-warning text-dark">Pending</span>';

	return (
		<div className="card mb-3 shadow-sm">
			<div className="card-body">
				<div className="d-flex justify-content-between align-items-start">
					<div>
						<h5 className="card-title mb-1">
							<strong>{s.furbish}</strong> &rarr; {s.english}
						</h5>
						<p className="text-muted small mb-2">
							Submitted by {s.username} &middot; {new Date(s.createdAt).toLocaleDateString()}
						</p>
					</div>
					<div className="text-end">
						<div className="mb-1" dangerouslySetInnerHTML={{ __html: statusBadge }} />
						<small className="text-muted">Score: {s.score}</small>
					</div>
				</div>
				<div className="d-flex gap-2">
					<button className="btn btn-sm btn-outline-success"
						onClick={() => onVote(s.id, "up")}>▲ Up ({s.upvotes})</button>
					<button className="btn btn-sm btn-outline-danger"
						onClick={() => onVote(s.id, "down")}>▼ Down ({s.downvotes})</button>
					<button className="btn btn-sm btn-outline-secondary"
						onClick={() => onComments(s.id)}>Comments ({s.commentCount})</button>
				</div>
			</div>
		</div>
	);
}
