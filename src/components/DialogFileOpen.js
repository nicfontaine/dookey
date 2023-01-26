import { useEffect, useRef } from "react";
import { setTodos } from "../feature/todosSlice";
import { setArchives } from "../feature/archivesSlice";
import { setTags } from "../feature/tagsSlice";
import { setSettings } from "../feature/settingsSlice";

export default function DialogFileOpen ({
	setStatusMsg,
	fileOpenSelect,
	setFileOpenSelect,
}) {

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
			setTodos(todos);
			setArchives(archives);
			setTags(tags);
			setSettings(settings);
			setStatusMsg("Loaded from file");
		});
		reader.addEventListener("error", (e) => {
			setStatusMsg("Failed to read file");
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