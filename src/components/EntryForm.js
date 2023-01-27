import { useState, useEffect, useRef } from "react";
import { v4 as uuid } from 'uuid';
import TextArea from "textarea-autosize-reactjs";
import { useDispatch, useSelector, batch } from "react-redux";
import { setCenter, setTitle, setFontSize, setBackups, setBackupsAbsolute } from "/src/feature/settingsSlice";
import { addTodo, unshiftTodo } from "/src/feature/todosSlice";
import { FlameIcon } from "@primer/octicons-react";
import EmojiPopup from "./EmojiPopup";
import Clock from "/src/components/Clock";
import { resetSettings } from "../feature/settingsSlice";
import { resetTodos } from "../feature/todosSlice";
import { resetArchives } from "../feature/archivesSlice";
import { resetTags } from "../feature/tagsSlice";
import { setStatusMessage } from "../feature/statusMessageSlice";
import exportData from "../util/export-data";
import saveData from "../util/save-data";

import entryCommands from "../util/entry-commands.js";

const EntryForm = ({
	entryInputRef,
	todoListRef,
	commandOptionsDisplay,
	setDialogImportShow,
	setCommandOptionsDisplay,
	setFileOpenSelect,
	goto,
}) => {
	
	const dispatch = useDispatch();

	const todoList = useSelector((state) => state.todos.value);
	const archiveList = useSelector((state) => state.archives.value);
	const tagList = useSelector((state) => state.tags.value);
	const settings = useSelector((state) => state.settings.value);
	const itemFocus = useSelector((state) => state.itemFocus.value);

	const [entryInput, setEntryInput] = useState("");
	const formRef = useRef(null);
	const [emojiPopupActive, setEmojiPopupActive] = useState(false);
	const [emojiKeyUpEvent, setEmojiKeyUpEvent] = useState({});
	const [emojiKeyDownEvent, setEmojiKeyDownEvent] = useState({});
	const [clockActive, setClockActive] = useState(false);

	useEffect(() => {
		entryInputRef.current.focus();
		entryInputRef.current.value = "";
	}, []);

	// Entry Input
	useEffect(() => {
		setCommandOptionsDisplay(entryInput[0] === "/");
	}, [entryInput]);

	const handleEntryInput = {
		
		change (e) {
			if (clockActive) return;
			e.preventDefault();
			// Ignore if a todo is focused
			if (itemFocus.index < 0) {
				let val = e.target.value;
				setEntryInput(val);
				if (todoListRef.current.scrollTop > 0) todoListRef.current.scrollTop = 0;
			}
		},

		active () {
			goto.entry();
			if (todoListRef.current) {
				todoListRef.current.scrollTop = 0;
			}
		},

		// In case focus leaves, but active doesn't change. Like to <body>
		blur (e) {
			// Changing windows/tabs doesn't really blur the input
			if (e.target !== document.activeElement) {
				formRef.current.classList.remove("active");
				entryInputRef.current.classList.remove("active");
			}
		},

		submit (e) {
			e.preventDefault();
		},

		keyUp (e) {
			setEmojiKeyUpEvent(e);
		},

		keyDown (e) {
			setEmojiKeyDownEvent(e);
			if (emojiPopupActive) {
				if (e.key === "Enter" || e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Tab") {
					e.preventDefault();
					return;
				}
			}

			if (!e.shiftKey && e.key === "Enter") {
				e.preventDefault();
				handleEntryInput.confirm();
				return;
			} else if (e.shiftKey && e.key === "Enter") {
				// setEntryInput(entryInput + "\n")
				return;
			} else if (e.key === " ") {
				if (entryInput[0] === "/") {
					if (entryInput.trim().split("/")[1] === "backups") {
						setEntryInput(`${entryInput} ${settings.backups}`);
					}
				}
			}

			if (e.key === "ArrowDown") {
				if (!entryInputRef.current.value.length && !e.ctrlKey) {
					e.preventDefault();
					goto.next(e);
				}
			} else if (e.key === "ArrowUp") {
				if (!entryInputRef.current.value.length && !e.ctrlKey) {
					e.preventDefault();
					goto.prev(e);
				}
			} else if (e.key === "Tab") {
				e.preventDefault();
				if (e.shiftKey) {
					goto.prev();
				} else {
					goto.next();
				}
			} else if (e.key === "Escape" && commandOptionsDisplay) {
				// Clear via escape, if viewing command overlay
				setEntryInput("");
			}
		},

		// User entry
		async confirm () {

			let val = entryInput.trim();
			if (!val.length) {
				setEntryInput("");
				return;
			} else if (val.indexOf("/") !== 0) {
				const _td = {
					text: val,
					id: uuid(),
					tags: [],
				};
				dispatch(unshiftTodo(_td));
				setEntryInput("");
			} else if (val.indexOf("/") === 0) {

				// NOTE: Cleanup and move
				val = val.replace(/  +/g, ' ').substring(val.indexOf("/") + 1, val.length);
				let args = val.split(" ");
				let command = args.shift();

				if (command in entryCommands) {
					const setMsg = dispatch(setStatusMessage);
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
						const _status = await exportData(todoList, archiveList, tagList, settings);
						dispatch(setStatusMessage([_status, 5000]));
					} else if (command === "import") {
						setDialogImportShow(true);
					} else if (command === "save") {
						const _res = await saveData(todoList, archiveList, tagList, settings);
						dispatch(setBackupsAbsolute(_res.backups));
						dispatch(setStatusMessage([_res.status, 5000]));
					} else if (command === "open") {
						setFileOpenSelect(true);
					} else if (command === "kill") {
						// entryCommands.kill(setMsg);
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
							console.log(res.backupsAbsolute);
							dispatch(setStatusMessage([`Location: ${res.backupsAbsolute}`, 8000]));
						}
					}
				}

				setEntryInput("");
				return;
			}
		},

	};

	return(
		<>
			<div className={`entry-container ${commandOptionsDisplay ? "commands-display" : ""}`}>
				<div className="entry-container-inner">
					<form
						className={`entry-form ${itemFocus.index === -1 ? "active" : ""}`}
						onSubmit={handleEntryInput.submit}
						ref={formRef}
					>
						<div className="entry-form-icon-main noevents">
							<FlameIcon size={18} />
						</div>

						<TextArea
							type="text"
							value={entryInput}
							id={"entry-input"}
							className={`entry-input ${itemFocus.index === -1 ? "active" : ""}`}
							onChange={handleEntryInput.change}
							onKeyDown={handleEntryInput.keyDown}
							onKeyUp={handleEntryInput.keyUp}
							onClick={handleEntryInput.active}
							onBlur={handleEntryInput.blur}
							tabIndex="0"
							rows="1"
							autoFocus
							placeholder="Add a todo"
							ref={entryInputRef}
						>{entryInput}</TextArea>

						<EmojiPopup
							active={emojiPopupActive}
							setActive={setEmojiPopupActive}
							inputText={entryInput}
							setInputText={setEntryInput}
							keyUpEvent={emojiKeyUpEvent}
							keyDownEvent={emojiKeyDownEvent}
							listMax={8}
						>
						</EmojiPopup>

					</form>
				</div>
			</div>

			<Clock active={clockActive} setActive={setClockActive}/>

		</>
	);

};
export default EntryForm;