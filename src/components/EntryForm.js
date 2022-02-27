(function(){"use strict"})()

import { useState, useEffect, useRef } from "react"
import { v4 as uuid } from 'uuid'
import autosize from "autosize"

import entryCommands from "../mod/entry-commands.js"

const EntryForm = ({
	todoListRef,
	setTodoList,
	todoList,
	activeIndex,
	setStatusMsg,
	setDialogImportShow,
	setCommandOptionsDisplay,
	setFileOpenSelect,
	setEntryRef,
	goto
}) => {

	const [entryInput, setEntryInput] = useState("")
  const entryInputRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
  	setEntryRef(entryInputRef.current)
  	entryInputRef.current.focus()
  	entryInputRef.current.value = ""
    autosize(entryInputRef.current)
    document.body.addEventListener("keydown", (e) => {
      if (e.target === document.body) {
        if (e.key === "/") {
        	e.preventDefault()
          goto.entry()
        }
      }
    })
  }, [])

  // Entry Input
  useEffect(() => {
    autosize.update(entryInputRef.current)
    if (entryInput[0] === "/") {
    	setCommandOptionsDisplay(true)
    } else {
    	setCommandOptionsDisplay(false)
    }
  }, [entryInput])

	const handleEntryInput = {
	  
	  change: (e) => {
	    e.preventDefault()
	    // Ignore if a todo is focused
	    if (activeIndex < 0) {
	      setEntryInput(e.target.value)
	    }
	  },

	  active: () => {
	  	goto.entry()
	    if (todoListRef.current) {
	    	todoListRef.current.scrollTop = 0
	    }
	  },

	  // In case focus leaves, but active doesn't change. Like to <body>
	  blur: (e) => {
	  	// Changing windows/tabs doesn't really blur the input
	  	if (e.target !== document.activeElement) {
		  	formRef.current.classList.remove("active")
		  	entryInputRef.current.classList.remove("active")
	  	}
	  },

	  submit: (e) => {
	    e.preventDefault()
	  },

	  keyDown: (e) => {
	    if (!e.shiftKey && e.key === "Enter") {
	      e.preventDefault()
	      handleEntryInput.confirm()
	      return;
	    } else if (e.shiftKey && e.key === "Enter") {
	      // setEntryInput(entryInput + "\n")
	      return;
	    }
	    if (e.key === "ArrowDown") {
	      if (!entryInputRef.current.value.length) {
	      	e.preventDefault()
	      	goto.next(e)
	      }
	    } else if (e.key === "ArrowUp") {
	      if (!entryInputRef.current.value.length) {
	      	e.preventDefault()
	      	goto.prev(e)
	      }
	    }
	    if (e.key === "Tab") {
	      e.preventDefault()
        if (e.shiftKey) {
        	goto.prev()
        } else {
        	goto.next()
        }
	    }
	    if (e.key === "Escape" && entryInput === "/") {
	    	setEntryInput("")
	    }
	  },

	  // Clear content
	  clear: () => {
	    setEntryInput("")
	  },

	  // User entry
	  confirm: () => {
	    let val = entryInput.trim()
	    if (!val.length) {
	      handleEntryInput.clear()
	      return;
	    }
	    // Commands
	    if (val.indexOf("/") === 0) {
	    	// NOTE: Cleanup and move
	      let command = val.split("/")[1]
	      if (command in entryCommands) {
	        switch(command) {
	          case "msg":
	            entryCommands[command](setStatusMsg, "test")
	            break
	          case "nuke":
	            entryCommands[command](setTodoList, setStatusMsg)
	            break
	          case "export":
	            entryCommands[command](todoList, setStatusMsg)
	            break
	          case "import":
	          	setDialogImportShow(true)
	            break
	          case "save":
	            entryCommands[command](todoList, setStatusMsg)
	            break
	          case "open":
	            entryCommands[command](setFileOpenSelect)
	            break
	        }
	        handleEntryInput.clear()
	        return;
	      }
	    }
	    setTodoList([
	      {
	        text: val,
	        id: uuid(),
	      },
	      ...todoList
	    ])
	    handleEntryInput.clear()
	  },

	}

	return(
		<>
		<form
			className={`entry-form ${activeIndex === -1 ? "active" : ""}`}
		  onSubmit={handleEntryInput.submit}
		  ref={formRef}
		>
		  <textarea
		    type="text"
		    value={entryInput}
		    className={`entry-input ${activeIndex === -1 ? "active" : ""}`}
		    onChange={handleEntryInput.change}
		    onKeyDown={handleEntryInput.keyDown}
		    onClick={handleEntryInput.active}
		    // onFocus={handleEntryInput.active}
		    onBlur={handleEntryInput.blur}
		    tabIndex="0"
		    autoFocus
		    placeholder="Add a todo"
		    ref={entryInputRef}
		  ></textarea>
		</form>
		</>
	)

}
export default EntryForm