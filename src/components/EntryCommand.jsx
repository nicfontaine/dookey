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
	resetSettings, setDensity, setImage, setSyncFile, setClockHour,
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
	
	const dispatch = useDispatch();
	const todoList = useSelector((state) => state.todos.value.todos);
	const archiveList = useSelector((state) => state.todos.value.archives);
	const tagList = useSelector((state) => state.tags.value);
	const settings = useSelector((state) => state.settings.value);

	useEffect(() => {
		checkCommand();
	}, [cmd]);

	const commands = {
		msg (args) {
			dispatch(setStatusMessage([args, 5000]));
		},
		clock (args) {
			const t = args[0];
			if (t) {
				dispatch(setClockHour(t));
			}
			setClockActive(true);
		},
		nuke () {
			batch(() => {
				dispatch(resetSettings());
				dispatch(resetTags());
				dispatch(resetTodos());
				dispatch(resetArchives());
				dispatch(setStatusMessage(["Todo list cleared", 5000]));
			});
		},
		async export () {
			const _status = await exportData(todoList, archiveList, tagList, settings);
			dispatch(setStatusMessage([_status, 5000]));
		},
		import () {
			setDialogImportShow(true);
		},
		async save () {
			const _res = await saveData(todoList, archiveList, tagList, settings);
			batch(() => {
				dispatch(setBackupsAbsolute(_res.backupsAbsolute));
				dispatch(setStatusMessage([_res.status, 5000]));
			});
		},
		open () {
			setFileOpenSelect(true);
		},
		help () {
			window.open(process.env.NEXT_PUBLIC_APP_HELP);
		},
		title (args) {
			dispatch(setTitle(args?.join(" ")));
		},
		full () {
			dispatch(setCenter(null));
		},
		center (args) {
			const size = args[0]?.trim();
			if (size) {
				dispatch(setCenter(size));
			} else {
				commands.full();
			}
		},
		density (args) {
			const density = args[0]?.trim();
			if (density && ["sm", "md", "lg"].indexOf(density) > -1) {
				dispatch(setDensity(density));
			}
		},
		size (args) {
			const size = args[0]?.trim();
			if (size) {
				dispatch(setFontSize(size));
			}
		},
		async backups (args) {
			if (!args) {
				setEntryInput(`${entryInput} ${settings.backupsAbsolute}`);
			}
			const location = args[0]?.trim();
			if (location) {
				dispatch(setBackups(location));
				const backupsAbsolute = await resolveBackupPath(location);
				if (backupsAbsolute.err) {
					dispatch(setStatusMessage(["Error resolving path", 5000]));
					return;
				}
				console.log(backupsAbsolute);
				dispatch(setBackupsAbsolute(backupsAbsolute));
				dispatch(setStatusMessage([`Location: ${backupsAbsolute}`, 8000]));
			}
		},
		sync (args) {
			const file = args[0]?.trim();
			if (file) {
				dispatch(setSyncFile(file));
			}
		},
		image (args) {
			const path = args[0]?.trim();
			dispatch(setImage(path));
		},
	};

	const checkCommand = function () {
		const args = cmd.split(" ");
		const command = args.shift();
		if (!cmd) return;
		if (command in commands) {
			commands[command](args);
			setEntryInput("");
			setEntryCommand("");
		}
	};

	return null;
};

export default EntryCommand;
