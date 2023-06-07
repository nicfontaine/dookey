import { useState, useRef, useEffect } from "react";
import csn from "classnames";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkGemoji from "remark-gemoji";
import { useDispatch, useSelector } from "react-redux";
import { archiveTodo, deleteTodo, moveTodoUp, moveTodoDown, unArchive, deleteArchive, moveArchiveUp, moveArchiveDown, addDeleteArchive, addDeleteTodo, insertArchiveAt, popDeleteTodo } from "../feature/todosSlice";
import { focusItemIndex, focusItemNext, focusItemPrev, focusItemEntry, focusTodoOrArchive, insertTodoAt } from "../feature/todosSlice";
import { CheckCircleFillIcon } from "@primer/octicons-react";
import { focusOut } from "../feature/todosSlice.js";

import TodoInput from "./TodoInput";
import TagInput from "./TagInput";

const Todo = ({
	todo,
	index,
	archived,
	itemIndexWidth,
}) => {

	const dispatch = useDispatch();
	const todoList = useSelector((state) => state.todos.value.todos);
	const archiveList = useSelector((state) => state.todos.value.archives);
	const tagList = useSelector((state) => state.tags.value);
	const focusIndex = useSelector((state) => state.todos.value.focusIndex);
	const todosDeleted = useSelector((state) => state.todos.value.todosDeleted);

	const [editIndex, setEditIndex] = useState(null);
	const [animOutIndex, setAnimOutIndex] = useState(null);
	const [editTag, setEditTag] = useState(null);

	const todoRef = useRef(null);

	var dragged = false;
	var mX, mY;

	useEffect(() => {
		if (focusIndex !== index) {
			todoRef?.current?.classList.remove("active");
		}
	});

	// Focus todo when list or focusIndex changes
	useEffect(() => {
		if (index === focusIndex) {
			todoRef.current.focus();
		}
	}, [focusIndex, todoList]);

	const moveUp = function () {
		if (focusIndex === todoList.length) {
			handleTodo.unArchive();
		} else if (focusIndex > 0) {
			if (focusIndex < todoList.length) {
				dispatch(moveTodoUp(index));
			} else {
				dispatch(moveArchiveUp(index));
			}
			dispatch(focusItemPrev(archiveList.length + todoList.length));
		}
	};

	const moveDown = function () {
		if (focusIndex === todoList.length - 1) {
			handleTodo.archive();
		} else if (focusIndex < archiveList.length + todoList.length - 1) {
			if (focusIndex < todoList.length) {
				dispatch(moveTodoDown(index));
			} else {
				dispatch(moveArchiveDown(index));
			}
			dispatch(focusItemNext(archiveList.length + todoList.length));
		}
	};

	const handleTodo = {

		focus (e) {
			todoRef?.current?.classList.add("active");
		},

		blur (e) {
			// todoRef.current.classList.remove("active");
			// console.log("blur todo");
			// e.target.blur();
		},

		// Set active todo to edit mode
		edit (e) {
			setEditIndex(index);
			dispatch(focusItemIndex(null));
			dispatch(focusOut());
		},

		archiveStart (e) {
			setAnimOutIndex(focusIndex);
			setTimeout(() => handleTodo.archive(), 150);
		},

		archive () {
			let next = focusIndex;
			if (next === todoList.length - 1) next -= 1;
			dispatch(focusItemIndex(next));
			dispatch(archiveTodo(todo));
		},

		unArchive () {
			const _index = focusIndex - todoList.length;
			const _td = archiveList[_index];
			dispatch(unArchive(_td));
			dispatch(focusItemIndex(focusIndex));
		},

		// Mark task for delete
		deleteStart (e) {
			e.target.style.height = e.target.getBoundingClientRect().height + "px";
			setAnimOutIndex(focusIndex);
			setTimeout(() => handleTodo.delete(), 150);
		},

		// Remove from data, and list. Set next active position
		delete () {
			setAnimOutIndex(null);
			if (archived) {
				dispatch(addDeleteTodo({ todo, index, archived: true }));
				dispatch(deleteArchive(todo));
				dispatch(focusItemIndex(focusIndex - 1));
			} else {
				let next = focusIndex;
				if (next === todoList.length - 1) next -= 1;
				dispatch(addDeleteTodo({ todo, index: index - todoList.length }));
				dispatch(deleteTodo(todo));
				dispatch(focusItemIndex(next));
			}
		},

		// Click to activate todo
		click () {
			dispatch(focusItemIndex(index));
			if (!dragged && focusIndex === index) {
				// setEditIndex(index)
			} else {
				setEditIndex(null);
			}
			dragged = false;
		},

		// Track if click+dragging, so user can copy todo w/o editing
		mouseDown (e) {
			mX = e.clientX;
			mY = e.clientY;
		},

		mouseUp (e) {
			dragged = e.clientX !== mX && e.clientY !== mY;
		},

		keyDown (e) {
			const ctrl = e.ctrlKey || e.metaKey;
			// TODO: Cleanup
			if (!e.target.classList.contains("todo")) {
				return;
			}
			if (e.key === "Enter") {
				e.preventDefault();
				handleTodo.edit(e);
			} else if (e.key === "Delete" || e.key === "Backspace") {
				e.preventDefault();
				handleTodo.deleteStart(e);
			} else if (e.key === "e") {
				e.preventDefault();
				handleTodo.edit(e);
			} else if (e.key === "t") {
				e.preventDefault();
				setEditTag(true);
			} else if (e.key === "d") {
				// TODO: Date
			} else if (e.key === "a") {
				e.preventDefault();
				if (focusIndex >= todoList.length) {
					handleTodo.unArchive();
				} else {
					handleTodo.archiveStart(e);
				}
			} else if (e.key === "/" || (e.key === "l" && ctrl)) {
				e.preventDefault();
				dispatch(focusItemEntry());
			} else if (e.key === "o" || e.key === " ") {
				let details = e.target.getElementsByTagName("details");
				for (const d of details) {
					d.open = !d.open;
					d.classList.add("open");
				}
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				if (!ctrl) {
					dispatch(focusItemNext(archiveList.length + todoList.length));
				} else if (e.shiftKey && ctrl) {
					moveDown();
				}
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				if (!ctrl) {
					dispatch(focusItemPrev(archiveList.length + todoList.length));
				} else if (e.shiftKey && ctrl) {
					moveUp();
				}
			} else if (e.key === "Tab") {
				e.preventDefault();
				let len = archiveList.length + todoList.length;
				e.shiftKey ? dispatch(focusItemPrev(len)) : dispatch(focusItemNext(len));
			} else if (e.key === "Home") {
				e.preventDefault();
				dispatch(focusItemIndex(0));
			} else if (e.key === "End") {
				e.preventDefault();
				dispatch(focusItemIndex(todoList.length + archiveList.length - 1));
			} else if (e.key === "z" && ctrl) {
				if (!todosDeleted.length) return;
				const _td = todosDeleted[todosDeleted.length - 1];
				if (_td.archived) {
					dispatch(insertArchiveAt(_td));
				} else {
					dispatch(insertTodoAt(_td));
				}
				dispatch(popDeleteTodo());
			}

		},

	};

	if (index === editIndex) {

		return (
			<TodoInput 
				todo={todo}
				editIndex={editIndex}
				setEditIndex={setEditIndex}
			/>
		);

	} else {

		return (
			
			<button
				ref={todoRef}
				className={csn("todo todo-focus focus-group-todo",
					// { active:todo.focus || false },
					{ animOut:index === animOutIndex },
					{ archive: archived || false },
					// { active: focusIndex === index },
				)}
				onFocus={handleTodo.focus}
				onBlur={handleTodo.blur}
				onClick={handleTodo.click}
				onMouseDown={handleTodo.mouseDown}
				onMouseUp={handleTodo.mouseUp}
				onKeyDown={handleTodo.keyDown}
				autoFocus={focusIndex === index}
				tabIndex="0"
			>
				
				{!archived ?
					<span className="todo-index" style={{ flex: `0 0 ${itemIndexWidth}px` }}>{index + 1}</span> :
					<span className="todo-index">
						<CheckCircleFillIcon size={17}/>
					</span>
				}

				{/* {<span className="todo-index">{(index+10).toString(36)}</span>}*/}

				<div className="todo-text">
					<ReactMarkdown
						remarkPlugins={[remarkGfm, remarkGemoji]}
						rehypePlugins={[rehypeRaw]}
					>{todo.text}</ReactMarkdown>
				</div>

				{ todo.tags && todo.tags.length ?
					<div className="todo-tag-list">
						{ todo.tags.slice().filter((t) => tagList[t])
							.map((t) => {
								return <div key={tagList[t].id} className="tag" style={{ backgroundColor: tagList[t].color }}>{t}</div>;
							})
						}
					</div>
					: null }

				{ editTag ?
					<TagInput
						index={index}
						editTag={editTag}
						setEditTag={setEditTag}
					></TagInput>
					: null }

			</button>
		);

	}

};

export default Todo;