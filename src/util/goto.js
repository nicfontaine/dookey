import { useDispatch, useSelector } from "react-redux";
import { setFocusIndex } from "../feature/itemFocusSlice";

export default class GoTo {
	
	static index (i) {
		useDispatch(setFocusIndex(i));
	}

	static next () {
		let todos = this.mainRef.current.getElementsByClassName("todo-focus");
		if (this.itemFocus.activeIndex === todos.length - 1) {
			this.entry(); 
		} else {
			this.index(this.itemFocus.activeIndex + 1); 
		}
	}

	static prev () {
		let todos = this.mainRef.current.getElementsByClassName("todo-focus");
		if (this.itemFocus.activeIndex === -1) {
			this.index(todos.length - 1); 
		} else if (this.itemFocus.activeIndex === 0) {
			this.entry(); 
		} else {
			this.index(this.itemFocus.activeIndex - 1);
		}
	}

	static entry () {
		this.index(-1);
	}

	static exit () {
		this.index(null);
	}

}