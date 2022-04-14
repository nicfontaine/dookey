(function(){"use strict"})()

const CommandOptions = ({
	commandOptionsDisplay,
	mainFontSize
}) => {

	return(
		<>
			<div
				className={`entry-command-options
				${commandOptionsDisplay ? "show" : ""}`}
			>
				<div className="d-flx flx-row pd-l-8 pd-t-4">
					<div>
						<div className="mg-b-5"><span className="code">/export</span></div>
						<div className="mg-b-5"><span className="code">/import</span></div>
						<div className="mg-b-5"><span className="code">/save</span></div>
						<div className="mg-b-5"><span className="code">/open</span></div>
						<div className="mg-b-5"><span className="code">/nuke</span></div>
						<div className="mg-b-5"><span className="code">/size {mainFontSize}</span></div>
					</div>
					<div className="desc">
						<div className="mg-b-5">Copy data to clipboard</div>
						<div className="mg-b-5">Paste data, and load</div>
						<div className="mg-b-5">Save to backup file</div>
						<div className="mg-b-5">Load from backup file</div>
						<div className="mg-b-5">Delete all notes</div>
						<div className="mg-b-5">Set font-size to any number (Current size is displayed)</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				.entry-command-options {
					opacity: 0;
					position: fixed;
					top: 0; right: 0; bottom: 0; left: 0;
					padding-top: 4.72rem;
					background: rgba(0,0,0,0.6);
					z-index: 10;
					padding-left: 1rem;
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
			`}</style>
		</>
	)
}

export default CommandOptions