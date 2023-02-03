import { useState, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import TextArea from "textarea-autosize-reactjs";
import { useDispatch, useSelector } from "react-redux";
import { unshiftTodo, focusItemIndex, focusItemNext, focusItemPrev } from "/src/feature/todosSlice";
import { FlameIcon } from "@primer/octicons-react";
import EmojiPopup from "./EmojiPopup";
import Clock from "/src/components/Clock";
import EntryCommand from "./EntryCommand";

const EntryForm = ({
	entryInputRef,
	todoListRef,
	commandOptionsDisplay,
	setCommandOptionsDisplay,
	setDialogImportShow,
	setFileOpenSelect,
}) => {

	const dispatch = useDispatch();
	const settings = useSelector((state) => state.settings.value);
	const focusIndex = useSelector((state) => state.todos.value.focusIndex);
	const todoList = useSelector((state) => state.todos.value.todos);
	const archiveList = useSelector((state) => state.todos.value.archives);

	const formRef = useRef(null);
	const [entryInput, setEntryInput] = useState("");
	const [entryCommand, setEntryCommand] = useState("");
	const [emojiPopupActive, setEmojiPopupActive] = useState(false);
	const [emojiKeyUpEvent, setEmojiKeyUpEvent] = useState({});
	const [emojiKeyDownEvent, setEmojiKeyDownEvent] = useState({});
	const [clockActive, setClockActive] = useState(false);

	useEffect(() => {
		// entryInputRef.current.focus();
		entryInputRef.current.value = "";
	}, []);

	useEffect(() => {
		if (focusIndex === -1) {
			entryInputRef.current.focus();
		}
	}, [focusIndex]);

	// Entry Input
	useEffect(() => {
		setCommandOptionsDisplay(entryInput[0] === "/");
	}, [entryInput]);

	const handleEntryInput = {

		change (e) {
			if (clockActive) return;
			e.preventDefault();
			// Ignore if a todo is focused
			if (focusIndex < 0) {
				let val = e.target.value;
				setEntryInput(val);
				if (todoListRef.current.scrollTop > 0)
					todoListRef.current.scrollTop = 0;
			}
		},

		active () {
			dispatch(focusItemIndex(-1));
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

		focus (e) {},

		// User entry
		confirm () {
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
				let cmd = val
					.replace(/  +/g, " ")
					.substring(val.indexOf("/") + 1, val.length);
				setEntryCommand(cmd);
			}
		},

		keyDown (e) {
			setEmojiKeyDownEvent(e);
			if (emojiPopupActive) {
				if (
					e.key === "Enter" ||
					e.key === "ArrowDown" ||
					e.key === "ArrowUp" ||
					e.key === "Tab"
				) {
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
					dispatch(focusItemNext(archiveList.length + todoList.length));
				}
			} else if (e.key === "ArrowUp") {
				if (!entryInputRef.current.value.length && !e.ctrlKey) {
					e.preventDefault();
					dispatch(focusItemPrev(archiveList.length + todoList.length));
				}
			} else if (e.key === "Tab") {
				e.preventDefault();
				if (e.shiftKey) {
					dispatch(focusItemPrev(archiveList.length + todoList.length));
				} else {
					dispatch(focusItemNext(archiveList.length + todoList.length));
				}
			} else if (e.key === "Escape" && commandOptionsDisplay) {
				setEntryInput("");
			}
		},
	};

	return (
		<>
			<div
				className={`entry-container ${
					commandOptionsDisplay ? "commands-display" : ""
				}`}
			>
				<div className="entry-container-inner">
					<form
						className={`entry-form ${focusIndex === -1 ? "active" : ""}`}
						onSubmit={(e) => e.preventDefault()}
						ref={formRef}
					>
						<div className="entry-form-icon-main noevents">
							<FlameIcon size={18} />
						</div>

						<TextArea
							type="text"
							value={entryInput}
							id={"entry-input"}
							className={`entry-input ${
								focusIndex === -1 ? "active" : ""
							}`}
							onChange={handleEntryInput.change}
							onKeyDown={handleEntryInput.keyDown}
							onKeyUp={(e) => setEmojiKeyUpEvent(e)}
							onClick={handleEntryInput.active}
							onBlur={handleEntryInput.blur}
							onFocus={handleEntryInput.focus}
							tabIndex="0"
							rows="1"
							autoFocus
							placeholder="Add a todo"
							ref={entryInputRef}
						>
							{entryInput}
						</TextArea>

						<EmojiPopup
							active={emojiPopupActive}
							setActive={setEmojiPopupActive}
							inputText={entryInput}
							setInputText={setEntryInput}
							keyUpEvent={emojiKeyUpEvent}
							keyDownEvent={emojiKeyDownEvent}
							listMax={8}
						></EmojiPopup>
					</form>
				</div>
			</div>

			<Clock active={clockActive} setActive={setClockActive} />

			{/* { entryInput &&  */}
			<EntryCommand
				cmd={entryCommand}
				entryInput={entryInput}
				setDialogImportShow={setDialogImportShow}
				setFileOpenSelect={setFileOpenSelect}
				setEntryInput={setEntryInput}
				setEntryCommand={setEntryCommand}
				setClockActive={setClockActive}
			/>
			{/* } */}
		</>
	);
};
export default EntryForm;
