import { useEffect, useRef } from "react";
import { batch, useDispatch } from "react-redux";
import { setTodos, setArchives } from "../feature/todosSlice";
import { setTags } from "../feature/tagsSlice";
import { setSettings } from "../feature/settingsSlice";
import { setStatusMessage } from "../feature/statusMessageSlice";

export default function DialogFileOpen ({
	fileOpenSelect,
	setFileOpenSelect,
}) {

	const dispatch = useDispatch();
	const input = useRef(null);

	useEffect(() => {
		if (fileOpenSelect) {
			input.current.click();
			setFileOpenSelect(false);
		}
	}, [fileOpenSelect]);
	
	const fileUpload = (e) => {
		let file = e.target.files[0];
		if (!file) return;
		let reader = new FileReader();
		reader.addEventListener("load", (e) => {
			let { todos, tags, archives, settings } = JSON.parse(reader.result);
			batch(() => {
				dispatch(setTodos(todos));
				dispatch(setArchives(archives));
				dispatch(setTags(tags));
				dispatch(setSettings(settings));
				dispatch(setStatusMessage(["Loaded from file", 5000]));
			});
		});
		reader.addEventListener("error", (e) => {
			dispatch(setStatusMessage(["Failed to read file", 5000]));
		});
		reader.readAsText(file);
	};

	return(
		<>
			<div className="dialog-file-open">
				<input type="file" accept="json"
					ref={input}
					onChange={fileUpload}
				/>
			</div>

			<style jsx>{`
				.dialog-file-open {
					display: none;
				}
			`}</style>
		</>
	);

}