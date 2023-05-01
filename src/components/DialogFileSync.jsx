import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setStatusMessage } from "../feature/statusMessageSlice";
import { setSyncFile } from "../feature/settingsSlice";

export default function DialogFileSync ({
	fileSyncSelect,
	setFileSyncSelect,
}) {

	const dispatch = useDispatch();
	const input = useRef(null);

	useEffect(() => {
		if (fileSyncSelect) {
			input.current.click();
			setFileSyncSelect(false);
		}
	}, [fileSyncSelect]);
	
	const fileUpload = (e) => {
		let file = e.target.files[0];
		if (file) {
			dispatch(setSyncFile(file));
			dispatch(setStatusMessage(["Sync file set", 5000]));
		}
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