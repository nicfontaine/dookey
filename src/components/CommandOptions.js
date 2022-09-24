(function(){"use strict"})()

const CommandOptions = ({
	commandOptionsDisplay,
	settings
}) => {

	return(
		<>
			<div
				className={`entry-command-options
				${commandOptionsDisplay ? "show" : ""}`}
			>
				<div className="entry-command-options-inner pd-t-4">
					<h3 className="section-heading">Functions</h3>
					<div className="row d-flx flx-row">
						<div>
							<div className="mg-b-5"><span className="code">/export</span></div>
							<div className="mg-b-5"><span className="code">/import</span></div>
							<div className="mg-b-5"><span className="code">/save</span></div>
							<div className="mg-b-5"><span className="code">/open</span></div>
							<div className="mg-b-5"><span className="code">/nuke</span></div>
						</div>
						<div className="desc">
							<div className="mg-b-5">Copy data to clipboard</div>
							<div className="mg-b-5">Paste data, and load</div>
							<div className="mg-b-5">Save to local backup file</div>
							<div className="mg-b-5">Load from backup file</div>
							<div className="mg-b-5">Delete all notes</div>
						</div>
					</div>
					<h3 className="section-heading">Style</h3>
					<div className="row d-flx flx-row">
						<div>
							<div className="mg-b-5"><span className="code">/size {settings.fontSize}</span></div>
							<div className="mg-b-5"><span className="code">/center {settings.center || "<number>"}</span></div>
							<div className="mg-b-5"><span className="code">/center</span></div>
						</div>
						<div className="desc">
							<div className="mg-b-5">Set font-size to number</div>
							<div className="mg-b-5">Center layout to any pixel-width</div>
							<div className="mg-b-5">Full-width layout (default)</div>
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				.entry-command-options {
					opacity: 0;
					position: fixed;
					top: 0; right: 0; bottom: 0; left: 0;
					padding-top: 4.72rem;
					background: rgba(0,0,0,0.65);
					z-index: 10;
					transition: opacity 0.15s;
					pointer-events: none;
				}
				.entry-command-options.show {
					opacity: 1;
					pointer-events: auto;
				}
				.entry-command-options .desc {
					letter-spacing: 0.5px;
					padding-left: 1.1rem;
				}
				.entry-command-options .code {
					font-family: "PT Mono";
					background: rgba(255,255,255,0.2);
					padding: 0.05rem 0.35rem;
					border-radius: 4px;
					margin-right: 0.8rem;
				}
				.section-heading {
					margin-bottom: 1.5rem;
					border-top: 1px solid rgba(255,255,255,0.2);
					padding-top: 2rem;
				}
				.section-heading:first-child {
					border-top: none;
					padding-top: 0;
				}
				.entry-command-options-inner {
					padding-left: 2.9rem;
					padding-right: 2.9rem;
				}
				.entry-command-options-inner .row {
					margin-bottom: 1rem;
				}
				.entry-command-options-inner .row:last-child {
					margin-bottom: 0;
				}
			`}</style>
		</>
	)
}

export default CommandOptions