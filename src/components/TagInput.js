import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTag, setTags } from "../feature/tagsSlice";
import * as randomColor from "random-color";
import { v4 as uuid } from 'uuid';
import { setTodoTags, focusTodoOrArchive, focusItemIndex } from "../feature/todosSlice";
import { focusOut } from "../feature/todosSlice.js";

const TagInput = function ({ index, editTag, setEditTag }) {

	const dispatch = useDispatch();
	const [tagInput, setTagInput] = useState("");
	const tagInputRef = useRef(null);

	const focusIndex = useSelector((state) => state.todos.value.focusIndex);
	const focusIndexPrevious = useSelector((state) => state.todos.value.focusIndexPrevious);
	const todoList = useSelector((state) => state.todos.value.todos);
	const tagList = useSelector((state) => state.tags.value);

	useEffect(() => {
		if (editTag) {
			handleTagInput.active();
		}
	}, [editTag]);

	const handleTagInput = {

		active () {
			setTagInput(todoList[focusIndex].tags);
			dispatch(focusOut());
			dispatch(focusItemIndex(null));
		},

		deactive (e) {
			focusTodoOrArchive(focusIndexPrevious);
			dispatch(focusItemIndex(focusIndexPrevious));
			setEditTag(false);
		},

		change (e) {
			e.preventDefault();
			setTagInput(e.target.value);
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

	};
	
	return (
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
	);

};

export default TagInput;