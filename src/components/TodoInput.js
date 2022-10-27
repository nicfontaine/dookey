(function(){"use strict"})()

import { useState, useRef, useEffect } from "react"
import TextArea from "textarea-autosize-reactjs"
import EmojiPopup from "./EmojiPopup"

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
	const [todoCaretStart, setTodoCaretStart] = useState(todo.text.length-1)
	const todoTextBackup = todo.text
	const todoInputRef = useRef(null)

	const [emojiPopupActive, setEmojiPopupActive] = useState(false)
	const [emojiKeyUpEvent, setEmojiKeyUpEvent] = useState("")
	const [emojiKeyDownEvent, setEmojiKeyDownEvent] = useState("")

	// useEffect(() => {
	// 	todoInputRef.current.selectionStart = todoCaretStart
	// 	todoInputRef.current.selectionEnd = todoCaretStart
	// }, [todoInputText])

	function textSurround(target, _l, _r) {
		let val = target.value
  	let start = target.selectionStart
  	let end = target.selectionEnd
  	return `${val.slice(0, start)}${_l}${val.slice(start, end)}${_r}${val.slice(end)}`
	}

	// Todo edit input
	const handleTodoInput = {

	  // Input value change
	  change(e) {
	    setTodoInputText(e.target.value)
	    // e.target.style.minHeight = e.target.scrollHeight + "px"
	    // autosize.update(e.target)
	  },

	  focus(e) {
	    // Move cursor to end
	    setTimeout(() => {
	      e.target.selectionStart = e.target.selectionEnd = e.target.value.length
	    }, 0)
	    e.target.style.minHeight = e.target.scrollHeight + "px"
	    // autosize(e.target)
	    // autosize.update(e.target)
	  },

	  blur(e) {
	    handleTodoInput.unEdit(e)
	  },

	  unEdit(e) {
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
	  keyDown(e) {
			setEmojiKeyDownEvent(e)
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
			else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
				if (emojiPopupActive) {
					e.preventDefault()
					return;
				}
			}
	    // Unedit, or carraige return
	    else if (e.key === "Enter") {
				if (emojiPopupActive) {
					e.preventDefault()
					return;
				}
	      if (e.ctrlKey) {
	        e.preventDefault()
	        handleTodoInput.unEdit(e)
	      }
	    }
	    else if (e.key === "Tab") {
	      e.preventDefault()
				if (emojiPopupActive) return;
				let targ = e.target
				let start = targ.selectionStart
				let end = targ.selectionEnd
				setTodoCaretStart(start)
				setTodoInputText(e.target.value.substring(0, start) + "\t" + e.target.value.substring(end))
				e.target.selectionStart = e.target.selectionEnd = start + 1
	    }
	    // Bolden
	    else if (e.key === "b" && e.ctrlKey) {
	    	e.preventDefault()
				setTodoCaretStart(e.target.selectionStart)
	    	setTodoInputText(textSurround(e.target, "**", "**"))
	    }
	    else if (e.key === "i" && e.ctrlKey) {
	    	e.preventDefault()
				setTodoCaretStart(e.target.selectionStart)
	    	setTodoInputText(textSurround(e.target, "_", "**"))
	    }
			else if (e.key === "g" && e.ctrlKey) {
				e.preventDefault()
				let _l = "<details open><summary>Subtasks...</summary>\n<div>"
				setTodoCaretStart(e.target.selectionStart)
				setTodoInputText(textSurround(e.target, _l, "</div></details>"))
			}
	  },

		keyUp(e) {
			setEmojiKeyUpEvent(e)
		}

	}
	
	return(
		<>
		<div className="todo-edit-active">
			
			<TextArea className="todo-input todo-focus" type="text"
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
			></TextArea>

			<EmojiPopup
				active={emojiPopupActive}
				setActive={setEmojiPopupActive}
				inputText={todoInputText}
				setInputText={setTodoInputText}
				keyUpEvent={emojiKeyUpEvent}
				keyDownEvent={emojiKeyDownEvent}
			>
			</EmojiPopup>

		</div>
		</>
	)

}

export default TodoInput
