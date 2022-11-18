import { writeText } from "@tauri-apps/api/clipboard";

const entryCommands = {

	// Generic message. Not implemented
	msg (setStatusMsg, msg) {
		setStatusMsg(msg);
		entryCommands.statusClearDelay(setStatusMsg, 4000);
	},

	clock (clockActive, setClockActive) {
		setClockActive(true);
	},

	statusClearDelay (set, time) {
		setTimeout(() => set(""), time);
	},

	// NOTE: Should have a cleaner way to not have to pass these, or something
	nuke (setTodoList, setArchiveList, setTagList, setStatusMsg, setSettings, settingsDefault) {
		setTodoList([]);
		setArchiveList([]);
		setTagList({});
		setSettings(settingsDefault);
		setStatusMsg("Todo list cleared");
		entryCommands.statusClearDelay(setStatusMsg, 4000);
	},

	async export (todos, tags, settings, setStatusMsg, archive) {
		let txt = JSON.stringify({ todos, tags, settings, archive });
		if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
			if ("clipboard" in navigator) {
				navigator.clipboard.writeText(txt);
				setStatusMsg("Copied to clipboard (navigator)");
			} else if (window.__TAURI__) {
				await writeText(txt);
				setStatusMsg("Copied to clipboard (tauri)");
			} else {
				setStatusMsg("Failed to copy to clipboard");
			}
			entryCommands.statusClearDelay(setStatusMsg, 4000);
		}
	},

	import (importDialog, importInput, importDialogStatusText) {
		importDialogStatusText.current.innerHTML = "";
		importInput.current.focus();
	},

	// Open saved backup
	open (setFileOpenSelect) {
		setFileOpenSelect(true);
	},

	size (setMainFontSize, size) {
		setMainFontSize(size);
	},

	full () {},

	title () {},

	help () {},

	async backups (backups, settings, setSettings, setStatusMsg) {
		const response = await fetch("/api/set-backups-location", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ backups }),
		});
		const res = await response.json();
		if (res.err) {
			setStatusMsg(JSON.stringify(res.err)); 
		}
		setSettings({ ...settings, backups, backupsAbsolute: res.backupsAbsolute });
	},

	center (size) {
		if (size && Number(size) > 0) {
			document.querySelector(":root").style.setProperty("--main-center-width", `${size}px`);
			document.body.classList.add("center");
		} else {
			document.body.classList.remove("center");
		}
	},

	async save (todos, tags, settings, setSettings, setStatusMsg) {
		const response = await fetch("/api/backup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ todos, tags, settings }),
		});
		const res = await response.json();
		if (res.err) {
			setStatusMsg(JSON.stringify(res.err)); 
		}
		setStatusMsg("Saved to: " + res.path);
		setSettings({ ...settings, backupsAbsolute: res.backups });
		entryCommands.statusClearDelay(setStatusMsg, 8000);
	},

	async kill (setStatusMsg) {
		/*
		 * console.log("kill")
		 * const response = await fetch("/api/process-kill", {
		 *   method: "POST",
		 *   headers: {"Content-Type": "application/json"},
		 *   body: JSON.stringify({})
		 * })
		 * const res = await response.json()
		 * if (res.err) setStatusMsg(res.err)
		 */
	},

};

export default entryCommands;