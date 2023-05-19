import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const EntryCommandOptions = ({
	commandOptionsDisplay,
}) => {

	const settings = useSelector((state) => state.settings.value);
	const tags = useSelector((state) => state.tags.value);
	const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

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
					<div className="group-parent-2 d-flx flx-children-1 flx-spc-2 flx-children-spc-2">
						<div className="group d-flx flx-row">
							<div className="row"><span className="code">/export</span></div>
							<div className="row desc">Copy data to clipboard</div>
							<div className="row"><span className="code">/import</span></div>
							<div className="row desc">Paste &amp; merge data</div>
							{APP_ENV === "app" ? (
								<>
									<div className="row"><span className="code">/save</span></div>
									<div className="row desc">Save to local file</div>
									<div className="row"><span className="code">/open</span></div>
									<div className="row desc">Load from local file</div>
								</>
							) : null }
						</div>
						<div className="group d-flx flx-row">
							<div className="row"><span className="code">/nuke</span></div>
							<div className="row desc">Delete all notes</div>
							<div className="row"><span className="code">/help</span></div>
							<div className="row desc">More info in README</div>
							<div className="row"><span className="code">/clock</span></div>
							<div className="row desc">Clock overlay</div>
						</div>
					</div>

					<h2 className="section-heading"><span className="mg-r-1">⚙️</span> Settings</h2>
					
					<div className="group d-flx flx-row">
						<div className="row"><span className="code">/title &lt;text&gt;</span></div>
						<div className="row desc">Set a custom header name</div>
						<div className="row"><span className="code">/size {settings.fontSize || "<number>"}</span></div>
						<div className="row desc">Set font-size to number</div>
						<div className="row"><span className="code">/center {settings.center || "<number>"}</span></div>
						<div className="row desc">Center layout to any pixel-width</div>
						<div className="row"><span className="code">/density {settings.density || "<size>"}</span></div>
						<div className="row desc">UI Density: <span className="code">sm, md, lg</span></div>
						<div className="row"><span className="code">/full</span></div>
						<div className="row desc">Full-width layout (default)</div>
						<div className="row"><span className="code">/image &lt;url&gt;</span></div>
						<div className="row desc">Top backdrop image</div>
						{APP_ENV === "app" ? (
							<>
								<div className="row"><span className="code">/backups &lt;path&gt;</span></div>
								<div className="row desc">Change backup file location</div>
							</>
						) : null }
					</div>

				</div>
			</div>

			<style>{`
				.hide {
					display: none;
				}
				.group-parent-2 {
					align-items: flex-start;
					flex-wrap: wrap;
				}
				.group-parent-2 .group {
					flex: 1 0 285px;
				}
				.group {
					display: grid;
					grid-template-columns: auto 1fr;
					// grid-template-columns: fit-content(40%) 1fr;
					grid-template-rows: auto auto;
					gap: 0 0.8rem;
				}
				.entry-command-options {
					opacity: 0;
					position: fixed;
					top: 0; right: 0; bottom: 0; left: 0;
					// padding-top: 4.72rem;
					// padding-top: 8.8rem;
					padding-top: 8.5rem;
					background: rgba(0,0,0,0.75);
					z-index: 10;
					transition: opacity 0.15s, padding 0.3s ease-in;
					pointer-events: none;
				}
				.main-container.density-sm .entry-command-options {
					padding-top: 5.8rem;
				}
				.main-container.density-lg .entry-command-options {
					padding-top: 10rem;
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
				.entry-command-options .code:last-child {
					margin-right: 0;
				}
				.section-heading {
					margin-bottom: 0.8rem;
					padding-top: 1rem;
					// border-top: 1px solid rgba(255,255,255,0.2);
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
					// margin-bottom: 1rem;
				}
				.entry-command-options-inner .group:last-child {
					margin-bottom: 0;
				}
				.entry-command-options-inner .row {
					margin-bottom: 0.6rem;
				}
				.entry-command-options-inner .row:last-child {
					margin-bottom: 0;
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