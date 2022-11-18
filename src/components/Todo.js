import { useState, useRef } from "react";
import csn from "classnames";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkGemoji from "remark-gemoji";
import * as randomColor from "random-color";
import { v4 as uuid } from 'uuid';
import { CheckCircleFillIcon } from "@primer/octicons-react";

import TodoInput from "./TodoInput";

var deleteStore = [];

const Todo = ({
	todo,
	index,
	activeIndex,
	activeIndexPrevious,
	setActiveIndexPrevious,
	todoList,
	setTodoList,
	archiveList,
	setArchiveList,
	tagList,
	setTagList,
	goto,
	archived,
}) => {

	const [editIndex, setEditIndex] = useState(null);
	const [animOutIndex, setAnimOutIndex] = useState(null);
	
	const [tagInput, setTagInput] = useState("");
	const [editTag, setEditTag] = useState(null);

	const tagInputRef = useRef(null);

	var dragged = false;
	var mX;
	var mY;

	const move = {
		
		up () {
			if (activeIndex === todoList.length) {
				handleTodo.unArchive();
			} else if (activeIndex > 0) {
				if (activeIndex < todoList.length) {
					let _list = todoList.map((todo) => todo);
					_list.splice(activeIndex - 1, 0, _list.splice(activeIndex, 1)[0]);
					setTodoList(_list);
				} else {
					let _index = activeIndex - todoList.length;
					let _list = archiveList.map((todo) => todo);
					_list.splice(_index - 1, 0, _list.splice(_index, 1)[0]);
					setArchiveList(_list);
				}
				goto.prev();
			}
		},

		down () {
			if (activeIndex === todoList.length - 1) {
				handleTodo.archive();
			} else if (activeIndex < archiveList.length + todoList.length - 1) {
				if (activeIndex < todoList.length) {
					let _list = todoList.map((todo) => todo);
					_list.splice(activeIndex + 1, 0, _list.splice(activeIndex, 1)[0]);
					setTodoList(_list);
				} else {
					let _index = activeIndex - todoList.length;
					let _list = archiveList.map((todo) => todo);
					_list.splice(_index + 1, 0, _list.splice(_index, 1)[0]);
					setArchiveList(_list);
				}
				goto.next();
			}
		},

	};

	const handleTodo = {

		// Set active todo to edit mode
		edit (e) {
			setEditIndex(index);
			setActiveIndexPrevious(activeIndex);
			goto.exit();
		},

		archiveStart (e) {
			setAnimOutIndex(activeIndex);
			setTimeout(() => handleTodo.archive(), 150);
		},

		archive () {
			setArchiveList([todoList[activeIndex], ...archiveList]);
			handleTodo.delete(activeIndex);
		},

		unArchive () {
			let _index = activeIndex - todoList.length;
			let _td = archiveList[_index];
			setArchiveList(archiveList.filter((todo, index) => {
				if (index !== _index) {
					return todo; 
				}
			}));
			setTodoList([...todoList, _td]);
		},

		// Mark task for delete
		deleteStart (e) {
			e.target.style.height = e.target.getBoundingClientRect().height + "px";
			setAnimOutIndex(activeIndex);
			deleteStore.push({ todo: todoList[activeIndex], index });
			setTimeout(() => handleTodo.delete(activeIndex), 150);
			
		},

		// Remove from data, and list. Set next active position
		delete (_index) {
			setAnimOutIndex(null);
			if (_index < todoList.length) {
				let _list = todoList.filter((todo, index) => {
					if (index !== _index) {
						return todo; 
					}
				});
				handleTodo.postDeleteIndex(_list.length + archiveList.length);
				setTodoList(_list);
			} else {
				_index -= todoList.length;
				let _list = archiveList.filter((todo, index) => {
					if (index !== _index) {
						return todo; 
					}
				});
				handleTodo.postDeleteIndex(_list.length + todoList.length);
				setArchiveList(_list);
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
				}
				// At end, up 1
				else if (activeIndex === newLength) {
					newIndex = activeIndex - 1; 
				}
				goto.index(newIndex);
				// Else, stay on same line
			}
		},

		focus (e, index) {
			/*
			 * Expand any <details>
			 * NOTE: r-click is focusing, so we'll just change the index as well
			 * NOTE: This is messing up when moving todos, and focusing the old place
			 * goto.index(index)
			 * e.target.classList.add("active")
			 * console.log("Todo: " + index + " has been focused")
			 */
		},

		blur (e, index) {
			// setEditTag(false)
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
			if (e.clientX !== mX && e.clientY !== mY) {
				dragged = true;
			} else {
				dragged = false;
			}
		},

		keyDown (e) {
			// NOTE: Move all of this to a module
			if (!e.target.classList.contains("todo")) {
				return;
			}
			if (e.key === "Enter") {
				e.preventDefault();
				handleTodo.edit(e);
			} else if (e.key === "Delete" || e.key === "d") {
				e.preventDefault();
				handleTodo.deleteStart(e);
			} else if (e.key === "e") {
				e.preventDefault();
				handleTodo.edit(e);
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
			} else if (e.key === "t") {
				e.preventDefault();
				handleTagInput.active();
			} else if (e.key === "o" || e.key === " ") {
				let details = e.target.getElementsByTagName("details");
				for (const d of details) {
					d.open = !d.open;
					d.classList.add("open");
				}
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				// Move focus
				if (!e.ctrlKey) {
					goto.next();
				}
				// Move todo
				else if (e.shiftKey && e.ctrlKey) {
					move.down();
				}
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				// Move focus
				if (!e.ctrlKey) {
					goto.prev();
				}
				// Move todo
				else if (e.shiftKey && e.ctrlKey) {
					move.up();
				}
			} else if (e.key === "Tab") {
				e.preventDefault();
				if (e.shiftKey) {
					goto.prev();
				} else {
					goto.next();
				}
			} else if (e.key === "Home") {
				e.preventDefault();
				goto.index(0);
			} else if (e.key === "End") {
				e.preventDefault();
				goto.index(todoList.length + archiveList.length - 1);
			} else if (e.key === "z" && e.ctrlKey) {
				if (!deleteStore.length) {
					return;
				}
				let _td = deleteStore.pop();
				let _list = todoList.map((todo) => todo);
				_list.splice(_td.index, 0, _td.todo);
				goto.index(_td.index);
				setTodoList(_list);
			}

		},

	};

	const handleTagInput = {

		active () {
			setActiveIndexPrevious(activeIndex);
			goto.exit();
			setEditTag(true);
			setTagInput(todoList[activeIndex].tags);
		},

		deactive (e) {
			e.target.blur();
			goto.index(activeIndexPrevious);
			// NOTE: Covering the todo active css transition with a delay is ugly
			setTimeout(() => {
				setEditTag(false);
			}, 100);
		},

		submit (e) {
			e.preventDefault();
			let inputTags = tagInputRef.current.value.replace(/\s/g, "").split(",");
			inputTags = inputTags.filter((a) => {
				if (a.length && a !== ",") {
					return a;
				}
			});
			setTodoList(todoList.map((todo, index) => {
				if (index === activeIndexPrevious) {
					todo.tags = inputTags;
				}
				return todo;
			}));
			let _tglist = Object.assign({}, tagList);
			let ts = [...inputTags];
			while (ts.length) {
				let tg = ts.shift();
				if (!(tg in _tglist)) {
					let color = randomColor(0.25, 0.99).hexString();
					_tglist[tg] = { id: uuid(), color };
				}
			}
			setTagList(_tglist);
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
				index={index}
				todoList={todoList}
				goto={goto}
				setTodoList={setTodoList}
				archiveList={archiveList}
				setArchiveList={setArchiveList}
				editIndex={editIndex}
				setEditIndex={setEditIndex}
				activeIndexPrevious={activeIndexPrevious}
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
				onFocus={(e) => handleTodo.focus(e, index)}
				onBlur={(e) => handleTodo.blur(e, index)}
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
						{ todo.tags.map((t) => {
							return <div key={tagList[t].id} className="tag" style={{ backgroundColor: tagList[t].color }}>{t}</div>;
						}) }
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