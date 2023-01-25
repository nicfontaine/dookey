import { useEffect, useRef } from "react";

import entryCommands from "../util/entry-commands.js";

const DialogImport = ({
	goto,
	todoList,
	setTodoList,
	tagList,
	setTagList,
	archiveList,
	setArchiveList,
	setStatusMsg,
	dialogImportShow,
	setDialogImportShow,
	settings,
	setSettings,
}) => {

	const importInput = useRef(null);
	const importDialog = useRef(null);
	const importDialogStatusText = useRef(null);

	useEffect(() => {
		if (dialogImportShow) {
			handleImport.show();
		} else {
			handleImport.hide();
		}
	}, [dialogImportShow]);

	// Todo list import dialog
	const handleImport = {

		hide: () => {
			importInput.current.value = "";
			goto.entry();
		},

		show: () => {
			goto.element(importInput.current);
			entryCommands.import(importDialog, importInput, importDialogStatusText);
		},
		
		submit: (e) => {
			e.preventDefault();
			let val = importInput.current.value;
			if (val !== undefined && val.length) {
				try {
					val = JSON.parse(val);
					setDialogImportShow(false);
					let _ids = [];
					setStatusMsg("Imported");
					entryCommands.statusClearDelay(setStatusMsg, 2000);
					/*
					 * Combine w/ existing. Reject duplicates
					 * NOTE: move to 'combiner' function
					 */
					setTodoList([...todoList, ...val.todos].filter((todo) => {
						if (_ids.indexOf(todo.id) < 0) {
							_ids.push(todo.id);
							return todo;
						}
					}));
					// NOTE: Merge archive, settings, tags
					setArchiveList([...archiveList, ...val.archive]);
					setTagList({ ...tagList, ...val.tags });
					setSettings({ ...settings, ...val.settings });
				} catch(err) {
					importDialogStatusText.current.innerHTML = err;
				}
			}
		},

		keyDown: (e) => {
			// "ESC"
			if (e.key === "Escape") {
				e.preventDefault();
				setDialogImportShow(false);
			}
			if (e.key === "Tab") {
				e.preventDefault();
			}
		},

	};

	return(
		<>
			<div id="dialog-import"
				className={`dialog ${dialogImportShow && "active"}`}
				ref={importDialog}
			>
				<div className="inner w-full w-mx-300">
					<h3 className="mg-t-0 mg-b-3 text-center">Paste Your Input</h3>
					<form onSubmit={handleImport.submit}>
						<input
							className="import-input w-full"
							ref={importInput}
							onKeyDown={handleImport.keyDown}
						/>
					</form>
					<div ref={importDialogStatusText}></div>
				</div>
			</div>
			<style jsx>{`
			.dialog {
				z-index: 20;
			}
		`}</style>
		</>
	);

};

export default DialogImport;