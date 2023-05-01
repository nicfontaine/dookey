import { useEffect } from "react";
import { useDispatch, useSelector, batch } from "react-redux";
import { resetTodos, resetArchives } from "../feature/todosSlice";
import { resetTags } from "../feature/tagsSlice";
import {
	setCenter,
	setTitle,
	setFontSize,
	setBackups,
	setBackupsAbsolute,
	resetSettings, setDensity, setImage, setSyncFile,
} from "../feature/settingsSlice";
import { setStatusMessage } from "../feature/statusMessageSlice";
import exportData from "../util/export-data";
import saveData from "../util/save-data";
import resolveBackupPath from "../util/resolve-backup-path";

const EntryCommand = function ({
	cmd,
	entryInput,
	setDialogImportShow,
	setFileOpenSelect,
	setEntryInput,
	setEntryCommand,
	setClockActive,
}) {
	
	if (!cmd) return null;

	const dispatch = useDispatch();
	const todoList = useSelector((state) => state.todos.value.todos);
	const archiveList = useSelector((state) => state.todos.value.archives);
	const tagList = useSelector((state) => state.tags.value);
	const settings = useSelector((state) => state.settings.value);

	useEffect(() => {
		checkCommand();
	}, [entryInput]);

	// Asyc helpers
	const handleExport = async function () {
		const _status = await exportData(todoList, archiveList, tagList, settings);
		dispatch(setStatusMessage([_status, 5000]));
	};
	const handleSave = async function () {
		const _res = await saveData(todoList, archiveList, tagList, settings);
		batch(() => {
			dispatch(setBackupsAbsolute(_res.backupsAbsolute));
			dispatch(setStatusMessage([_res.status, 5000]));
		});
	};
	const handleBackupLocation = async function (location) {
		dispatch(setBackups(location));
		const backupsAbsolute = await resolveBackupPath(settings);
		console.log(backupsAbsolute);
		dispatch(setBackupsAbsolute(backupsAbsolute));
		dispatch(setStatusMessage([`Location: ${backupsAbsolute}`, 8000]));
	};

	const checkCommand = function () {
		
		let args = cmd.split(" ");
		let command = args.shift();

		if (command === "msg") {
			dispatch(setStatusMessage([args, 5000]));
		} else if (command === "clock") {
			setClockActive(true);
		} else if (command === "nuke") {
			batch(() => {
				dispatch(resetSettings());
				dispatch(resetTags());
				dispatch(resetTodos());
				dispatch(resetArchives());
				dispatch(setStatusMessage(["Todo list cleared", 5000]));
			});
		} else if (command === "export") {
			handleExport();
		} else if (command === "import") {
			setDialogImportShow(true);
		} else if (command === "save") {
			handleSave();
		} else if (command === "open") {
			setFileOpenSelect(true);
		} else if (command === "kill") {
			// TODO:
		} else if (command === "help") {
			window.open(process.env.NEXT_PUBLIC_APP_HELP);
		} else if (command === "title") {
			let title = args.join(" ");
			dispatch(setTitle(title));
		} else if (command === "full") {
			dispatch(setCenter(null));
		} else if (command === "center") {
			if (args[0] !== undefined) {
				let size = args[0].trim();
				dispatch(setCenter(size));
			}
		} else if (command === "density") {
			if (args[0] !== undefined) {
				let density = args[0].trim();
				if (["sm", "md", "lg"].indexOf(density) > -1) {
					dispatch(setDensity(density));
				}
			}
		} else if (command === "size") {
			if (args[0] === undefined) return;
			let size = args[0].trim();
			if (size) {
				dispatch(setFontSize(size));
			}
		} else if (command === "backups") {
			if (!args) {
				setEntryInput(`${entryInput} ${settings.backupsAbsolute}`);
			}
			let location = args[0].trim();
			if (location) {
				handleBackupLocation(location);
			}
		} else if (command === "sync") {
			let file = args[0].trim();
			if (file) {
				dispatch(setSyncFile(file));
			}
		} else if (command === "image") {
			let path = args[0].trim();
			if (path) {
				dispatch(setImage(path));
			}
		}
		setEntryInput("");
		setEntryCommand("");
	};

	return null;
};

export default EntryCommand;
