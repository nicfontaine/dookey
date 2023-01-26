import { useState, useRef } from "react";
import csn from "classnames";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkGemoji from "remark-gemoji";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, setTodoTags, deleteTodo, moveTodoUp, moveTodoDown } from "/src/feature/todosSlice";
import { unshiftArchive, deleteArchive, moveArchiveUp, moveArchiveDown } from "/src/feature/archivesSlice";
import { setFocusIndexPrevious } from "../feature/itemFocusSlice";
import { addTag, setTags } from "/src/feature/tagsSlice";
import * as randomColor from "random-color";
import { v4 as uuid } from 'uuid';
import { CheckCircleFillIcon } from "@primer/octicons-react";

import TodoInput from "./TodoInput";
import { insertTodoAt } from "../feature/todosSlice";

var deleteStore = [];

const Todo = ({
	todo,
	index,
	archived,
	activeIndex,
	goto,
}) => {

	const dispatch = useDispatch();
	const todoList = useSelector((state) => state.todos.value);
	const archiveList = useSelector((state) => state.archives.value);
	const tagList = useSelector((state) => state.tags.value);
	const itemFocus = useSelector((state) => state.itemFocus.value);

	const [editIndex, setEditIndex] = useState(null);
	const [animOutIndex, setAnimOutIndex] = useState(null);
	
	const [tagInput, setTagInput] = useState("");
	const [editTag, setEditTag] = useState(null);

	const tagInputRef = useRef(null);

	var dragged = false;
	var mX, mY;

	const move = {
		
		up () {
			if (activeIndex === todoList.length) {
				handleTodo.unArchive();
			} else if (activeIndex > 0) {
				if (activeIndex < todoList.length) {
					dispatch(moveTodoUp(index));
				} else {
					dispatch(moveArchiveUp(index));
				}
				goto.prev();
			}
		},

		down () {
			if (activeIndex === todoList.length - 1) {
				handleTodo.archive();
			} else if (activeIndex < archiveList.length + todoList.length - 1) {
				if (activeIndex < todoList.length) {
					dispatch(moveTodoDown(index));
				} else {
					dispatch(moveArchiveDown(index));
				}
				goto.next();
			}
		},

	};

	const handleTodo = {

		// Set active todo to edit mode
		edit (e) {
			setEditIndex(index);
			dispatch(setFocusIndexPrevious(activeIndex));
			goto.exit();
		},

		archiveStart (e) {
			setAnimOutIndex(activeIndex);
			setTimeout(() => handleTodo.archive(), 150);
		},

		archive () {
			dispatch(unshiftArchive(todo));
			handleTodo.deleteTodo(todo);
		},

		unArchive () {
			const _index = activeIndex - todoList.length;
			const _td = archiveList[_index];
			dispatch(addTodo(_td));
			dispatch(deleteArchive(_td));
		},

		// Mark task for delete
		deleteStart (e) {
			e.target.style.height = e.target.getBoundingClientRect().height + "px";
			setAnimOutIndex(activeIndex);
			deleteStore.push({ todo: todoList[activeIndex], index });
			setTimeout(() => handleTodo.delete(activeIndex), 150);
		},

		deleteTodo (_todo) {
			dispatch(deleteTodo(_todo));
		},

		// Remove from data, and list. Set next active position
		delete (_index, _todo) {
			setAnimOutIndex(null);
			// TODO: handleTodo.postDeleteIndex()
			console.log(archived);
			if (archived) {
				dispatch(deleteArchive(todo));
			} else {
				dispatch(deleteTodo(todo));
			}
			if (_index < todoList.length) {
				// dispatch(deleteTodo(todo));
				// let _list = todoList.filter((todo, index) => {
				// 	if (index !== _index) {
				// 		return todo; 
				// 	}
				// });
				// handleTodo.postDeleteIndex(_list.length + archiveList.length);
				// setTodoList(_list);
			} else {
				// _index -= todoList.length;
				// let _list = archiveList.filter((todo, index) => {
				// 	if (index !== _index) {
				// 		return todo; 
				// 	}
				// });
				// handleTodo.postDeleteIndex(_list.length + todoList.length);
				// dispatch(deleteArchive(archiveList[_index]));
				// setArchiveList(_list);
			}
		},

		// Update activeIndex after deletion, based on number of other tasks
		postDeleteIndex (newLength) {
			// Check if activeIndex Needs to change
			let newIndex = activeIndex;
			if (activeIndex > -1) {
				// No todos. Go to entry
				if (!newLength) {
					newIndex = -1; 
				} else if (activeIndex === newLength) {
					// At end, up 1
					newIndex = activeIndex - 1; 
				}
				goto.index(newIndex);
				// Else, stay on same line
			}
		},

		// Click to activate todo
		click (e, index) {
			// Already selected - edit mode
			goto.index(index);
			if (!dragged && activeIndex === index) {
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
			// NOTE: Move all of this to a module
			if (!e.target.classList.contains("todo")) {
				return;
			}
			if (e.key === "Enter") {
				e.preventDefault();
				handleTodo.edit(e);
			} else if (e.key === "Delete") {
				e.preventDefault();
				handleTodo.deleteStart(e);
			} else if (e.key === "e") {
				e.preventDefault();
				handleTodo.edit(e);
			} else if (e.key === "t") {
				e.preventDefault();
				handleTagInput.active();
			} else if (e.key === "d") {
				// Date
			} else if (e.key === "a") {
				e.preventDefault();
				if (activeIndex >= todoList.length) {
					handleTodo.unArchive();
				} else {
					handleTodo.archiveStart(e);
				}
			} else if (e.key === "/" || (e.key === "l" && e.ctrlKey)) {
				e.preventDefault();
				goto.index(-1);
			} else if (e.key === "o" || e.key === " ") {
				let details = e.target.getElementsByTagName("details");
				for (const d of details) {
					d.open = !d.open;
					d.classList.add("open");
				}
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				if (!e.ctrlKey) {
					goto.next();
				} else if (e.shiftKey && e.ctrlKey) {
					move.down();
				}
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				if (!e.ctrlKey) {
					goto.prev();
				} else if (e.shiftKey && e.ctrlKey) {
					move.up();
				}
			} else if (e.key === "Tab") {
				e.preventDefault();
				e.shiftKey ? goto.prev() : goto.next();
			} else if (e.key === "Home") {
				e.preventDefault();
				goto.index(0);
			} else if (e.key === "End") {
				e.preventDefault();
				goto.index(todoList.length + archiveList.length - 1);
			} else if (e.key === "z" && e.ctrlKey) {
				if (!deleteStore.length) return;
				let _td = deleteStore.pop();
				dispatch(insertTodoAt(_td));
				goto.index(_td.index);
			}

		},

	};

	const handleTagInput = {

		active () {
			dispatch(setFocusIndexPrevious(activeIndex));
			setActiveIndexPrevious(activeIndex);
			goto.exit();
			setEditTag(true);
			setTagInput(todoList[activeIndex].tags);
		},

		deactive (e) {
			e.target.blur();
			goto.index(itemFocus.indexPrevious);
			// NOTE: Covering the todo active css transition with a delay is ugly
			setTimeout(() => {
				setEditTag(false);
			}, 100);
		},

		submit (e) {
			e.preventDefault();
			let inputTags = tagInputRef.current.value.replace(/\s/g, "").split(",");
			inputTags = inputTags.filter((a) => a.length && a !== ",");
			let _td = { ...todoList[index], tags: inputTags };
			dispatch(setTodoTags(_td));
			// TODO: Cleanup, in the reducer
			let _tglist = Object.assign({}, tagList);
			inputTags.forEach((t) => {
				if (!(t in _tglist)) {
					let color = randomColor(0.25, 0.99).hexString();
					let _t = { id: uuid(), color };
					dispatch(addTag({ [t]: _t }));
					_tglist[t] = _t;
				}
			});
			dispatch(setTags(_tglist));
			handleTagInput.deactive(e);
		},

		keydown (e) {
			if (e.key === "Tab") e.preventDefault();
			if (e.key === "Escape") {
				handleTagInput.deactive(e);
			}
			if (e.key === " ") {
				e.preventDefault();
				let v = tagInputRef.current.value;
				if (v[v.length - 1] !== ",") {
					setTagInput(v + ",");
				}
			}
		},

		change (e) {
			e.preventDefault();
			setTagInput(e.target.value);
		},

	};

	if (index === editIndex) {

		return (
			<TodoInput 
				todo={todo}
				goto={goto}
				editIndex={editIndex}
				setEditIndex={setEditIndex}
			/>
		);

	} else {

		let isAnimOut = index === animOutIndex;
		let isActive = index === activeIndex;

		return(
			<button
				className={csn("todo todo-focus",
					{ active:isActive },
					{ animOut:isAnimOut },
					{ archive:archived || false },
				)}
				onClick={(e) => handleTodo.click(e, index)}
				onMouseDown={handleTodo.mouseDown}
				onMouseUp={handleTodo.mouseUp}
				onKeyDown={handleTodo.keyDown}
				autoFocus={todo.active}
				tabIndex="0"
			>
				
				{ !archived ?
					<span className="todo-index">{index + 1}</span> :
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
					<div className="todo-tag-edit">
						<span className="icon">&#9873;</span>
						<div className="heading">Tags</div>
						<form onSubmit={handleTagInput.submit}>
							<input
								ref={tagInputRef}
								value={tagInput || ""}
								onChange={handleTagInput.change}
								onKeyDown={handleTagInput.keydown}
								placeholder="comma-separated tags"
								autoFocus
							></input>
						</form>
					</div>
					: null }

			</button>
		);

	}

};

export default Todo;