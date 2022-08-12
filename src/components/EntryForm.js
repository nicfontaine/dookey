(function(){"use strict"})()

import { useState, useEffect, useRef } from "react"
import { v4 as uuid } from 'uuid'
import TextArea from "textarea-autosize-reactjs"
import autosize from "autosize"

import entryCommands from "../mod/entry-commands.js"

const EntryForm = ({
	todoListRef,
	setTodoList,
	todoList,
	tagList,
	activeIndex,
	setStatusMsg,
	commandOptionsDisplay,
	setDialogImportShow,
	setCommandOptionsDisplay,
	setFileOpenSelect,
	setEntryRef,
	goto,
	setMainFontSize
}) => {

	const [entryInput, setEntryInput] = useState("")
  const entryInputRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
  	setEntryRef(entryInputRef.current)
  	entryInputRef.current.focus()
  	entryInputRef.current.value = ""
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

	  focus: (e) => {},

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
	    // Clear via escape, if viewing command overlay
	    if (e.key === "Escape" && commandOptionsDisplay) {
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
	    	let args = val.split("/")[1].split(" ")
	      let command = args[0]
	      if (command in entryCommands) {
	        switch(command) {
	          case "msg":
	            entryCommands.msg(setStatusMsg, "test")
	            break
	          case "nuke":
	            entryCommands.nuke(setTodoList, setStatusMsg)
	            break
	          case "export":
	            entryCommands.export(todoList, tagList, setStatusMsg)
	            break
	          case "import":
	          	setDialogImportShow(true)
	            break
	          case "save":
	            entryCommands.save(todoList, tagList, setStatusMsg)
	            break
	          case "open":
	            entryCommands.open(setFileOpenSelect)
	            break
	          case "size":
							let size = args[1].split(" ")[0]
							if (size) {
								entryCommands.size(setMainFontSize, Number(size))
							}
	          	break
	        }
	        handleEntryInput.clear()
	        return;
	      }
	    }
	    setTodoList([
	      {
	        text: val,
	        id: uuid()
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
		  <TextArea
		    type="text"
		    value={entryInput}
		    className={`entry-input ${activeIndex === -1 ? "active" : ""}`}
		    onChange={handleEntryInput.change}
		    onKeyDown={handleEntryInput.keyDown}
		    onClick={handleEntryInput.active}
		    onFocus={handleEntryInput.focus}
		    onBlur={handleEntryInput.blur}
		    tabIndex="0"
		    rows="1"
		    autoFocus
		    placeholder="Add a todo"
		    ref={entryInputRef}
		  >{entryInput}</TextArea>

		</form>
		</>
	)

}
export default EntryForm