import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const EntryCommandOptions = ({
	commandOptionsDisplay,
}) => {

	const settings = useSelector((state) => state.settings.value);
	const tags = useSelector((state) => state.tags.value);

	const entryCommandOptionsRef = useRef(null);

	return(
		<>
			<div
				ref={entryCommandOptionsRef}
				className={`entry-command-options
					${commandOptionsDisplay ? "show" : ""}
					${settings.title ? "" : "no-title"}
				`}
			>
				<div className="entry-command-options-inner pd-t-7">

					<div className="entry-command-tags-container">
						<span className="icon mg-r-4">🏷️</span>
						<div className="tags-row flx-spc-2 flx-children-spc-1">
							{Object.keys(tags).length ? Object.keys(tags).map((tagName) => {
								return (
									<div
										key={tags[tagName].id}
										className="tag"
										style={{ backgroundColor: tags[tagName].color }}
									>{tagName}</div>
								);
							}) : <span className="text-italic">(Tags here)</span>}
						</div>
					</div>

					<h2 className="section-heading"><span className="mg-r-1">🏭</span> Functions</h2>
					<div className="d-flx flx-children-1 flx-spc-2 flx-children-spc-2">
						<div className="group d-flx flx-row">
							<div>
								<div className="row"><span className="code">/export</span></div>
								<div className="row"><span className="code">/import</span></div>
								<div className="row"><span className="code">/save</span></div>
								<div className="row"><span className="code">/open</span></div>
							</div>
							<div className="desc">
								<div className="row">Copy data to clipboard</div>
								<div className="row">Paste &amp; merge data</div>
								<div className="row">Save to local backup file</div>
								<div className="row">Load from backup file</div>
							</div>
						</div>
						<div className="group d-flx flx-row">
							<div>
								<div className="row"><span className="code">/nuke</span></div>
								<div className="row"><span className="code">/help</span></div>
								<div className="row"><span className="code">/clock</span></div>
							</div>
							<div className="desc">
								<div className="row">Delete all notes</div>
								<div className="row">More info in README</div>
								<div className="row">Display a clock overlay</div>
							</div>
						</div>
					</div>
					<h2 className="section-heading"><span className="mg-r-1">⚙️</span> Settings</h2>
					<div className="group d-flx flx-row">
						<div>
							<div className="row"><span className="code">/title</span> <span className="code">&lt;text&gt;</span></div>
							<div className="row"><span className="code">/size</span><span className="code">{settings.fontSize || "<number>"}</span></div>
							<div className="row"><span className="code">/center</span> <span className="code">{settings.center || "<number>"}</span></div>
							<div className="row"><span className="code">/full</span></div>
							<div className="row"><span className="code">/backups {settings.backups}</span></div>
						</div>
						<div className="desc">
							<div className="row">Set a custom header name</div>
							<div className="row">Set font-size to number</div>
							<div className="row">Center layout to any pixel-width</div>
							<div className="row">Full-width layout (default)</div>
							<div className="row">Change backup file location</div>
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
					padding-top: 8.8rem;
					padding-top: 10.5rem;
					background: rgba(0,0,0,0.65);
					z-index: 10;
					transition: opacity 0.15s, padding 0.3s ease-in;
					pointer-events: none;
				}
				.entry-command-options.show {
					opacity: 1;
					pointer-events: auto;
				}
				.entry-command-options.no-title {
					padding-top: 6rem;
				}
				.entry-command-options .desc {
					letter-spacing: 0.5px;
				}
				.entry-command-options .code {
					font-family: "DM Mono";
					background: rgba(255,255,255,0.2);
					padding: 0.05rem 0.35rem;
					border-radius: 4px;
					margin-right: 0.8rem;
					font-size: 0.92rem;
					line-height: 1;
				}
				.section-heading {
					margin-bottom: 1rem;
					padding-top: 1rem;
					border-top: 1px solid rgba(255,255,255,0.2);
				}
				.section-heading:first-child {
					border-top: none;
					padding-top: 0;
				}
				.entry-command-options-inner {
					padding-left: 1.7rem;
					padding-right: 1.7rem;
				}
				.entry-command-options-inner .group {
					margin-bottom: 1rem;
				}
				.entry-command-options-inner .group:last-child {
					margin-bottom: 0;
				}
				.entry-command-options-inner .row {
					margin-bottom: 1rem;
				}
				.entry-command-tags-container .icon {
					align-self: flex-start;
					font-size: 1.2rem;
					line-height: 1;
				}
				.text-italic {
					font-style: italic;
				}
			`}</style>
		</>
	);
};

export default EntryCommandOptions;