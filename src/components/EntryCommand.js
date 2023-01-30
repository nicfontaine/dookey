import { useEffect } from "react";
import { useDispatch, useSelector, batch } from "react-redux";
import { resetSettings } from "../feature/settingsSlice";
import { resetTodos } from "../feature/todosSlice";
import { resetArchives } from "../feature/archivesSlice";
import { resetTags } from "../feature/tagsSlice";
import {
	setCenter,
	setTitle,
	setFontSize,
	setBackups,
	setBackupsAbsolute,
} from "/src/feature/settingsSlice";
import { setStatusMessage } from "../feature/statusMessageSlice";
import exportData from "../util/export-data";
import saveData from "../util/save-data";

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
	const todoList = useSelector((state) => state.todos.value);
	const archiveList = useSelector((state) => state.archives.value);
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
			dispatch(setBackupsAbsolute(_res.backups));
			dispatch(setStatusMessage([_res.status, 5000]));
		});
	};

	const handleBackup = async function () {
		dispatch(setBackups(location));
		const response = await fetch("/api/set-backups-location", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ backups: location }),
		});
		const res = await response.json();
		if (res.err) {
			dispatch(setStatusMessage([JSON.stringify(res.err), 5000]));
			return;
		}
		setBackupsAbsolute(res.backupsAbsolute);
		dispatch(setStatusMessage([`Location: ${res.backupsAbsolute}`, 8000]));
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
			window.open(process.env.APP_HELP);
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
				handleBackup();
			}
		}

		setEntryInput("");
		setEntryCommand("");
	};

	return null;
};

export default EntryCommand;
