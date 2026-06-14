import { useState } from "react";
import { Link } from "react-router-dom";
import { translate } from "../api";

export default function Translate() {
	const [text, setText] = useState("");
	const [direction, setDirection] = useState("furbish");
	const [output, setOutput] = useState(null);

	async function handleTranslate() {
		if (!text.trim()) return;
		const data = await translate(text, direction);
		setOutput(data.output);
	}

	return (
		<main className="container py-5">
			<div className="row justify-content-center">
				<div className="col-lg-8">
					<div className="text-center mb-5">
						<h1 className="display-5 fw-bold" style={{ color: "#6f42c1" }}>Furbish Translator</h1>
						<p className="text-muted">Translate between English and the language of Furbys</p>
					</div>

					<div className="card shadow-sm">
						<div className="card-body p-4">
							<div className="mb-3">
								<label className="form-label fw-semibold">Direction</label>
								<div className="btn-group w-100" role="group">
									<input type="radio" className="btn-check" name="direction" id="dir-furbish"
										checked={direction === "furbish"} onChange={() => setDirection("furbish")} />
									<label className="btn btn-outline-primary" htmlFor="dir-furbish">English &rarr; Furbish</label>

									<input type="radio" className="btn-check" name="direction" id="dir-english"
										checked={direction === "english"} onChange={() => setDirection("english")} />
									<label className="btn btn-outline-primary" htmlFor="dir-english">Furbish &rarr; English</label>
								</div>
							</div>

							<div className="mb-3">
								<label htmlFor="input-text" className="form-label fw-semibold">Enter text</label>
								<textarea className="form-control" id="input-text" rows="3"
									placeholder="Type something..." value={text} onChange={e => setText(e.target.value)} />
							</div>

							<button className="btn btn-primary w-100 mb-3"
								style={{ background: "#6f42c1", borderColor: "#6f42c1" }}
								onClick={handleTranslate}>Translate</button>

							{output !== null && (
								<div>
									<label className="form-label fw-semibold">Translation</label>
									<div className="bg-light rounded p-3" style={{ minHeight: "60px" }}>{output}</div>
								</div>
							)}
						</div>
					</div>

					<div className="card mt-4 shadow-sm">
						<div className="card-body">
							<h5 className="card-title">About</h5>
							<p className="card-text text-muted mb-1">
								Translates between English and <strong>Furbish</strong>, the language of the original
								1998 Furby toys. Dictionary entries include official words from the Furby guidebook,
								compound words, and community-submitted translations.
							</p>
							<p className="card-text text-muted mb-0">
								Inspired by
								<a href="https://www.reddit.com/r/furby/" target="_blank" rel="noopener"> r/furby</a>.
								Submit your own translations on the
								<Link to="/submissions"> Proposals</Link> page!
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
