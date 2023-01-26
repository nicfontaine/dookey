export default class GoTo {

	static activeIndex = -1;

	// State update, set from index.js
	setFocusElement () {}

	static #focusElement (e) {
		this.activeIndex = null;
		this.setFocusElement(e);
	}

	static #focusIndex (i) {
		this.activeIndex = i;
		if (this.activeIndex < 1) todoListRef.current.scrollTop = 0;
		if (this.activeIndex === -1) {
			this.setFocusElement(entryInputRef.current);
		} else if (this.activeIndex > -1) {
			// TODO: Cleanup
			let todos = mainRef.current.getElementsByClassName("todo-focus");
			this.setFocusElement(todos[this.activeIndex]);
		} else if (!i) {
			this.setFocusElement(null);
		}
	}
	
	static index (i) {
		dispatch(setFocusIndexPrevious(this.activeIndex));
		this["#focusIndex"](i);
	}

	static element (e) {
		this["#focusElement"](e);
	}

	static next () {
		let todos = mainRef.current.getElementsByClassName("todo-focus");
		if (this.activeIndex === todos.length - 1) {
			this.entry(); 
		} else {
			this.index(this.activeIndex + 1); 
		}
	}

	static prev () {
		let todos = mainRef.current.getElementsByClassName("todo-focus");
		if (this.activeIndex === -1) {
			this.index(todos.length - 1); 
		} else if (this.activeIndex === 0) {
			this.entry(); 
		} else {
			this.index(this.activeIndex - 1);
		}
	}

	static entry () {
		this.index(-1);
	}

	static exit () {
		this.index(null);
	}

}