import { useState, useRef } from "react";
import EmojiPopup from "./EmojiPopup";
import { useSelector, useDispatch } from "react-redux";
import { setTodoText, setArchiveText, focusItemIndex } from "../feature/todosSlice";
import textSurround from "../util/text-surround";
import TextareaAutosize from "@mui/base/TextareaAutosize";

const TodoInput = ({
	todo,
	editIndex,
	setEditIndex,
}) => {

	const dispatch = useDispatch();
	const todoList = useSelector((state) => state.todos.value.todos);
	const archiveList = useSelector((state) => state.todos.value.archives);
	const focusIndex = useSelector((state) => state.todos.value.focusIndex);
	const focusIndexPrevious = useSelector((state) => state.todos.value.focusIndexPrevious);

	const [todoInputText, setTodoInputText] = useState(todo.text);
	const [todoCaretStart, setTodoCaretStart] = useState(todo.text.length - 1);
	const todoTextBackup = todo.text;
	const todoInputRef = useRef(null);

	const [emojiPopupActive, setEmojiPopupActive] = useState(false);
	const [emojiKeyUpEvent, setEmojiKeyUpEvent] = useState({});
	const [emojiKeyDownEvent, setEmojiKeyDownEvent] = useState({});

	/*
	 * useEffect(() => {
	 * 	todoInputRef.current.selectionStart = todoCaretStart
	 * 	todoInputRef.current.selectionEnd = todoCaretStart
	 * }, [todoInputText])
	 */

	// Todo edit input
	const handleTodoInput = {

		// Input value change
		change (e) {
			setTodoInputText(e.target.value);
			/*
			 * e.target.style.minHeight = e.target.scrollHeight + "px"
			 * autosize.update(e.target)
			 */
		},

		focus (e) {
			// Move cursor to end
			setTimeout(() => {
				e.target.selectionStart = e.target.selectionEnd = e.target.value.length;
			}, 0);
			e.target.style.minHeight = e.target.scrollHeight + "px";
			/*
			 * autosize(e.target)
			 * autosize.update(e.target)
			 */
		},

		blur (e) {
			handleTodoInput.unEdit(e);
		},

		unEdit (e) {
			setEditIndex(null);
			let val = e.target.value;
			// NOTE: Not correctly focusing archived todo
			const ip = focusIndexPrevious;
			dispatch(focusItemIndex(ip));
			if (ip < todoList.length) {
				let _td = { ...todoList[ip], text: val };
				dispatch(setTodoText(_td));
			} else {
				let _td = { ...archiveList[ip - todoList.length], text: val };
				dispatch(setArchiveText(_td));
			}
		},

		// Handle special keys like enter, escape, etc
		keyDown (e) {
			const ctrl = e.ctrlKey || e.metaKey;
			setEmojiKeyDownEvent(e);
			// "ESC"
			if (e.key === "Escape") {
				e.preventDefault();
				const ip = focusIndexPrevious;
				dispatch(focusItemIndex(ip));
				if (ip < todoList.length) {
					let _td = { ...todoList[ip], text: todoTextBackup };
					dispatch(setTodoText(_td));
				} else {
					let _td = { ...archiveList[ip - todoList.length], text: todoTextBackup };
					dispatch(setArchiveText(_td));
				}
				// dispatch(setTodoText(_td));
				// TODO: need this?
				// goto.index(focusIndexPrevious);
				setEditIndex(null);
			} else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
				if (emojiPopupActive) {
					e.preventDefault();
					return;
				}
			} else if (e.key === "Enter") {
				// Unedit, or carraige return
				if (emojiPopupActive) {
					e.preventDefault();
					return;
				}
				if (ctrl) {
					e.preventDefault();
					handleTodoInput.unEdit(e);
				}
			} else if (e.key === "Tab") {
				e.preventDefault();
				if (emojiPopupActive) return;
				let targ = e.target;
				let start = targ.selectionStart;
				let end = targ.selectionEnd;
				setTodoCaretStart(start);
				setTodoInputText(e.target.value.substring(0, start) + "\t" + e.target.value.substring(end));
				e.target.selectionStart = e.target.selectionEnd = start + 1;
			} else if (ctrl) {
				if (e.key === "b") {
					// Bolden
					e.preventDefault();
					setTodoCaretStart(e.target.selectionStart);
					setTodoInputText(textSurround(e.target, "**", "**"));
				} else if (e.key === "i") {
					e.preventDefault();
					setTodoCaretStart(e.target.selectionStart);
					setTodoInputText(textSurround(e.target, "_", "_"));
				} else if (e.key === "g") {
					e.preventDefault();
					let _l = "<details><summary>Subtasks...</summary>\n<div>";
					setTodoCaretStart(e.target.selectionStart);
					setTodoInputText(textSurround(e.target, _l, "</div></details>"));
				}
			}
		},

		keyUp (e) {
			setEmojiKeyUpEvent(e);
		},

	};
	
	return(
		<>
			<div className="todo-edit-active">
			
				<TextareaAutosize className="todo-input todo-focus" type="text"
					value={todoInputText || ""}
					onChange={handleTodoInput.change}
					onKeyDown={handleTodoInput.keyDown}
					onKeyUp={handleTodoInput.keyUp}
					onFocus={handleTodoInput.focus}
					// onBlur={handleTodoInput.blur}
					autoFocus
					tabIndex="0"
					rows="1"
					ref={todoInputRef}
				></TextareaAutosize>

				<EmojiPopup
					active={emojiPopupActive}
					setActive={setEmojiPopupActive}
					inputText={todoInputText}
					setInputText={setTodoInputText}
					keyUpEvent={emojiKeyUpEvent}
					keyDownEvent={emojiKeyDownEvent}
					listMax={8}
				>
				</EmojiPopup>

			</div>
		</>
	);

};

export default TodoInput;
