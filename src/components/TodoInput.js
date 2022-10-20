// (function(){"use strict"})()

import { useState, useRef, useEffect } from "react"
import autosize from "autosize"
import TextArea from "textarea-autosize-reactjs"
import csn from "classnames"
import FuzzySearch from "fuzzy-search"
import { gemoji } from "gemoji"

const fuzzysearch = new FuzzySearch(gemoji,
	["names"],
	{sort: true}
)

var isTypingEmoji = false

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
	const [emojiSearchString, setEmojiSearchString] = useState("")
	const [emojiList, setEmojiList] = useState([])

	useEffect(() => {
		// autosize(todoInputRef.current)
	}, [])

	useEffect(() => {
		let sel = window.getSelection().getRangeAt(0)
		console.log(sel)
		if (emojiSearchString.length) {
			let search = fuzzysearch.search(emojiSearchString).slice(0, 6).map((s, i) => {
				s.active = i === 0 ? true : false
				return s
			})
			if (search.length) setEmojiList(search)
			else setEmojiList([])
		} else {
			setEmojiList([])
		}
	}, [emojiSearchString])

	function textSurround(target, _l, _r) {
		let val = target.value
  	let start = target.selectionStart
  	let end = target.selectionEnd
  	return `${val.slice(0, start)}${_l}${val.slice(start, end)}${_r}${val.slice(end)}`
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
				let targ = e.target
				let start = targ.selectionStart
				let end = targ.selectionEnd
				e.target.value = e.target.value.substring(0, start) + "\t" + e.target.value.substring(end)
				e.target.selectionStart = e.target.selectionEnd = start + 1
	    }
	    // Bolden
	    else if (e.key === "b" && e.ctrlKey) {
	    	e.preventDefault()
	    	e.target.value = textSurround(e.target, "**", "**")
	    }
	    else if (e.key === "i" && e.ctrlKey) {
	    	e.preventDefault()
	    	e.target.value = textSurround(e.target, "_", "**")
	    }
			else if (e.key === "g" && e.ctrlKey) {
				e.preventDefault()
				let _l = "<details open><summary>Subtasks...</summary>\n<div>"
				e.target.value = textSurround(e.target, _l, "</div></details>")
			}
			else if (e.key === ":") {
				isTypingEmoji = true
				// Initializing emoji search
			}
			else if (e.key === "Backspace") {
				// Backspace 1 colon, last of emoji-word
				if (e.target.value[e.target.selectionStart-1] === ":") {
					// Disabling emoji search
					isTypingEmoji = false
					if (emojiSearchString.length) setEmojiSearchString("")
				}
			}

			if (e.key === " " || e.key === "Enter") {
				// Disabling emoji search
				isTypingEmoji = false
				if (emojiSearchString.length) setEmojiSearchString("")
			}
	  },

		keyUp(e) {
			
			const val = e.target.value
			let start = e.target.selectionStart-1

			if (!val.length || val[start] === " ") {
				isTypingEmoji = false
				setEmojiSearchString("")
				return;
			}
			
			// Increment start to end of word
			let b = val[start]
			while (b && b !== " ") {
				start++
				b = val[start]
			}

			let word = ""
			let str = ""
			let c = val[start-1]
			while (c) {
				// console.log(`[${c}]`)
				// NOTE: Needs to work for newlines, after end of emoji string too
				if (c === " ") {
					word = ""
					break;
				}
				start--
				c = val[start]
				word += c
				if (c === ":") {
					str = word
					break;
				}
			}
			str = str.split("").reverse().join("")

			// NOTE: Not working when moving caret to colon at string start
			// if (str.length) isTypingEmoji = true
			if (str) {
				isTypingEmoji = true
			} else {
				isTypingEmoji = false
				str = ""
			}

			setEmojiSearchString(str.split(":")[1] || "")

		}

	}
	
	return(
		// <div style={{position:"relative"}}>
			// {<span className="todo-index">{index+1}</span>}
		<>

		<div className="todo-edit-active">
			
			<TextArea className="todo-input todo-focus" type="text"
			  value={todoInputText}
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

			{isTypingEmoji ? 
				<>
					<div className="emoji-list-container">
						<div className="emoji-list">
							{ emojiList.length ? emojiList.map((emoji, index) => {
								return (
									<div className={`emoji-list-item ${emoji.active ? "active" : ""}`} key={emoji.emoji}>
										<div className="emoji">{emoji.emoji}</div>
										<code className="code">:{emoji.names.join(",")}</code>
									</div>
								)
							}) : <div className="emoji-list-item-null">{emojiSearchString.length ? "No matches found" : "type for emoji search..."}</div> }
						</div>
						<div className="emoji-list-how-to"><code>Tab</code> to change selection. <code>Enter</code> to select</div>
					</div>
				</>
			: null}

			</div>

		</>
	)

}

export default TodoInput
