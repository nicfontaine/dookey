(function(){"use strict"})()

import { useState } from "react"
import autosize from "autosize"
import csn from "classnames"

const TodoInput = ({
		setTodoList,
		todoList,
		setEditMode,
		editTextSaved,
		setEditTextSaved,
		activeIndex,
		todo,
		setActiveIndex,
		activeIndexPrevious,
		setActiveIndexPrevious
	}) => {

	// Todo edit input
	const handleTodoInput = {

	  // Input value change
	  change: (e) => {
	    setEditMode(true)
	    setTodoInputText(e.target.value)
	    autosize.update(e.target)
	    setTodoList(todoList.map((todo, index) => {
	      if (index === activeIndex) {
	        todo.text = e.target.value
	      }
	      return todo
	    }))
	  },

	  focus: (e) => {
	    // Move cursor to end
	    setTimeout(() => {
	      e.target.selectionStart = e.target.selectionEnd = e.target.value.length
	    }, 0)
	    autosize(e.target)
	  },

	  blur: (e) => {
	    console.log("blur input")
	  },

	  unEdit: (e) => {
	    setEditMode(false)
	    let _list = todoList
	    let val = e.target.value
	    _list = _list.map((todo, index) => {
	      delete todo.edit
	      if (index === activeIndexPrevious) {
	        todo.text = val
	      }
	      return todo
	    }).filter((todo) => {
	      if (todo.text.length) {
	        return todo
	      }
	    })
	    setActiveIndex(activeIndexPrevious)
	    setFocusElement(activeTodo)
	    setTodoList(_list)
	  },

	  // Handle special keys like enter, escape, etc
	  keyDown: (e) => {
	    // "ESC"
	    if (e.key === "Escape") {
	      setEditMode(false)
	      setTodoList(todoList.map((todo) => {
	        if (todo.edit) {
	          todo.text = editTextSaved
	        }
	        delete todo.edit
	        return todo
	      }))
	      setActiveIndex(activeIndexPrevious)
	      setFocusElement(activeTodo)
	      // setActiveIndex(activeIndex)
	    }
	    // Unedit, or carraige return
	    if (e.key === "Enter") {
	      e.preventDefault()
	      if (!e.ctrlKey) {
	        handleTodoInput.unEdit(e)
	      } else {
	        e.target.value += "\n"
	        autosize.update(e.target)
	      }
	    }
	  }
	}
	
	return(
		<textarea className="todo-input" type="text"
		  value={todoInputText}
		  onChange={handleTodoInput.change}
		  onKeyDown={handleTodoInput.keyDown}
		  onFocus={handleTodoInput.focus}
		  onBlur={handleTodoInput.blur}
		  autoFocus
		  ref={todoRef}
		  rows="1"
		></textarea>
	)

}

export default TodoInput