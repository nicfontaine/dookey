import { useEffect, useRef } from "react";
import { useDispatch, batch } from "react-redux";
import { mergeArchiveList } from "../feature/archivesSlice.js";
import { mergeSettings } from "../feature/settingsSlice.js";
import { mergeTagList } from "../feature/tagsSlice.js";
import { mergeTodoList } from "../feature/todosSlice.js";
import { setStatusMessage } from "../feature/statusMessageSlice";

const DialogImport = ({
	goto,
	dialogImportShow,
	setDialogImportShow,
	setFocusElement,
}) => {

	const dispatch = useDispatch();
	const importInput = useRef(null);
	const importDialog = useRef(null);
	const importDialogStatusText = useRef(null);

	useEffect(() => {
		dialogImportShow ? handleImport.show() : handleImport.hide();
	}, [dialogImportShow]);

	// Todo list import dialog
	const handleImport = {

		hide: () => {
			importInput.current.value = "";
			goto.entry();
		},

		show: () => {
			// goto.exit();
			setFocusElement(importInput.current);
		},

		submit: (e) => {
			e.preventDefault();
			let val = importInput.current.value;
			if (val !== undefined && val.length) {
				try {
					val = JSON.parse(val);
					setDialogImportShow(false);
					batch(() => {
						dispatch(mergeTodoList(val.todos));
						dispatch(mergeArchiveList(val.archives));
						dispatch(mergeTagList(val.tags));
						dispatch(mergeSettings(val.settings));
						dispatch(setStatusMessage(["Imported", 50000]));
					});
				} catch (err) {
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

	return (
		<>
			<div
				id="dialog-import"
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
