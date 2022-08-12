(function(){"use strict"})()

import { useState, useRef, useEffect } from "react"
import autosize from "autosize"
import TextArea from "textarea-autosize-reactjs"
import csn from "classnames"

const TodoInput = ({
		todo,
		index,
		todoList,
		goto,
		setTodoList,
		editIndex,
		setEditIndex,
		activeIndexPrevious
	}) => {

	const [todoInputText, setTodoInputText] = useState(todo.text)
	const todoTextBackup = todo.text
	const todoInputRef = useRef(null)

	useEffect(() => {
		// autosize(todoInputRef.current)
	}, [])

	function textSurround(target, str) {
		let val = target.value
  	let start = target.selectionStart
  	let end = target.selectionEnd
  	return `${val.slice(0, start)}${str}${val.slice(start, end)}${str}${val.slice(end)}`
	}

	// Todo edit input
	const handleTodoInput = {

	  // Input value change
	  change: (e) => {
	    setTodoInputText(e.target.value)
	    // e.target.style.minHeight = e.target.scrollHeight + "px"
	    // autosize.update(e.target)
	  },

	  focus: (e) => {
	    // Move cursor to end
	    setTimeout(() => {
	      e.target.selectionStart = e.target.selectionEnd = e.target.value.length
	    }, 0)
	    e.target.style.minHeight = e.target.scrollHeight + "px"
	    // autosize(e.target)
	    // autosize.update(e.target)
	  },

	  blur: (e) => {
	    handleTodoInput.unEdit(e)
	  },

	  unEdit: (e) => {
	    setEditIndex(null)
	    let _list = todoList
	    let val = e.target.value
	    _list = _list.map((todo, index) => {
	      if (index === activeIndexPrevious) {
	        todo.text = val
	      }
	      return todo
	    }).filter((todo) => {
	      if (todo.text.length) {
	        return todo
	      }
	    })
	    goto.index(activeIndexPrevious)
	    setTodoList(_list)
	  },

	  // Handle special keys like enter, escape, etc
	  keyDown: (e) => {
	    // "ESC"
	    if (e.key === "Escape") {
	      e.preventDefault()
	      setTodoList(todoList.map((todo, index) => {
	        if (index === editIndex) {
	          todo.text = todoTextBackup
	        }
	        return todo
	      }))
	      goto.index(activeIndexPrevious)
	      setEditIndex(null)
	    }
	    // Unedit, or carraige return
	    else if (e.key === "Enter") {
	      if (e.ctrlKey) {
	        e.preventDefault()
	        handleTodoInput.unEdit(e)
	      } else {
	        // e.target.value += "\n"
	        // autosize.update(e.target)
	      }
	    }
	    else if (e.key === "Tab") {
	      e.preventDefault()
	      // NOTE: would be nice to have tabbed entry functionality
	    }
	    // Bolden
	    else if (e.key === "b" && e.ctrlKey) {
	    	e.preventDefault()
	    	e.target.value = textSurround(e.target, "**")
	    }
	    else if (e.key === "i" && e.ctrlKey) {
	    	e.preventDefault()
	    	e.target.value = textSurround(e.target, "_")
	    }
	  }
	}
	
	return(
		// <div style={{position:"relative"}}>
			// {<span className="todo-index">{index+1}</span>}
			<TextArea className="todo-input todo-focus" type="text"
			  value={todoInputText}
			  onChange={handleTodoInput.change}
			  onKeyDown={handleTodoInput.keyDown}
			  onFocus={handleTodoInput.focus}
			  // onBlur={handleTodoInput.blur}
			  autoFocus
			  tabIndex="0"
			  rows="1"
			  ref={todoInputRef}
			></TextArea>
		// </div>
	)

}

export default TodoInput