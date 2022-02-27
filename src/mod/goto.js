(function(){"use strict"})()

const goto = {
	next: () => {
	  let todos = mainRef.current.getElementsByClassName("todo-focus")
	  if (activeIndex === todos.length-1) { goto.entry() }
	  else { goto.index(activeIndex+1) }
	},
	prev: () => {
	  let todos = mainRef.current.getElementsByClassName("todo-focus")
	  if (activeIndex === -1) { goto.index(todos.length-1) }
	  else if (activeIndex === 0) { goto.entry() }
	  else { goto.index(activeIndex-1)}
	},
	entry: () => {
	  goto.index(-1)
	},
	exit: () => {
	  goto.index(null)
	},
	index: (i) => {
	  focusChange(i)
	},
	element: (e) => {
	  activeIndex = null
	  setFocusElement(e)
	}
}

export default goto