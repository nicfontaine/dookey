(function(){"use strict"})()

import { useState, useEffect, useRef } from "react"
import { v4 as uuid } from 'uuid'
import TextArea from "textarea-autosize-reactjs"
import { useDispatch } from "react-redux"
import { setCenter, setTitle, setFontSize } from "../feature/settingsSlice"

import { FlameIcon } from "@primer/octicons-react"

import entryCommands from "../mod/entry-commands.js"


const EntryForm = ({
	todoListRef,
	setTodoList,
	setTagList,
	todoList,
	tagList,
	activeIndex,
	activeIndexPrevious,
	setActiveIndexPrevious,
	setStatusMsg,
	commandOptionsDisplay,
	setDialogImportShow,
	setCommandOptionsDisplay,
	setFileOpenSelect,
	goto,
	settings,
	setSettings,
	settingsDefault
}) => {
	
	const dispatch = useDispatch()

	const [entryInput, setEntryInput] = useState("")
  const entryInputRef = useRef(null)
  const formRef = useRef(null)
	const [pickerDisplay, setPickerDisplay] = useState(false)
	const [emojiTyping, setEmojiTyping] = useState(false)

  useEffect(() => {
  	entryInputRef.current.focus()
  	entryInputRef.current.value = ""
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
				let val = e.target.value
	      setEntryInput(val)
				if (emojiTyping) {
					let emo = val.substring(entryInput.lastIndexOf(":") + 1)
				}
				if (todoListRef.current.scrollTop > 0) todoListRef.current.scrollTop = 0
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
	      if (!entryInputRef.current.value.length && !e.ctrlKey) {
	      	e.preventDefault()
	      	goto.next(e)
	      }
	    } else if (e.key === "ArrowUp") {
	      if (!entryInputRef.current.value.length && !e.ctrlKey) {
	      	e.preventDefault()
	      	goto.prev(e)
	      }
	    } else if (e.key === "Tab") {
	      e.preventDefault()
        if (e.shiftKey) {
        	goto.prev()
        } else {
        	goto.next()
        }
	    }
	    // Clear via escape, if viewing command overlay
	    else if (e.key === "Escape" && commandOptionsDisplay) {
	    	setEntryInput("")
	    }

			if (e.key === ":") {
				setEmojiTyping(true)
				setPickerDisplay(true)
			} else {
				setPickerDisplay(false)
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
	    	let args = val.replace(/  +/g, ' ').split("/")[1].split(" ")
	      let command = args[0]
	      if (command in entryCommands) {
					if (command === "msg") {
						entryCommands.msg(setStatusMsg, "test")
					} else if (command === "nuke") {
						entryCommands.nuke(setTodoList, setTagList, setStatusMsg, setSettings, settingsDefault)
					} else if (command === "export") {
						entryCommands.export(todoList, tagList, settings, setStatusMsg)
					} else if (command === "import") {
						setDialogImportShow(true)
					} else if (command === "save") {
						entryCommands.save(todoList, tagList, settings, setStatusMsg)
					} else if (command === "open") {
						entryCommands.open(setFileOpenSelect)
					} else if (command === "kill") {
						entryCommands.kill(setStatusMsg)
					} else if (command === "help") {
						window.open(process.env.APP_HELP)
					} else if (command === "title") {
						let title = args.splice(1).join(" ")
						setSettings({...settings, title: title })
						dispatch(setTitle(title))
					} else if (command === "full") {
						setSettings({...settings, center: null})
						dispatch(setCenter(null))
					} else if (command === "center") {
						if (args[1] !== undefined) {
							let size = args[1].trim()
							setSettings({...settings, center: size})
							dispatch(setCenter(size))
						}
					} else if (command === "size") {
						if (args[1] === undefined) return;
						let size = args[1].trim()
						if (size) {
							setSettings({...settings, fontSize: size })
							dispatch(setFontSize(size))
							// entryCommands.size(setMainFontSize, Number(size))
						}
					}
				}
	      handleEntryInput.clear()
	      return;
	    }
	    setTodoList([
	      {
	        text: val,
	        id: uuid()
	      },
	      ...todoList
	    ])
	    handleEntryInput.clear()
	  }

	}

	return(
		<>
		<div className="entry-container">
			<div className="entry-container-inner">
				<form
					className={`entry-form ${activeIndex === -1 ? "active" : ""}`}
					onSubmit={handleEntryInput.submit}
					ref={formRef}
				>
					<div className="entry-form-icon-main noevents">
						<FlameIcon size={18} />
					</div>

					<TextArea
						type="text"
						value={entryInput}
						id={"entry-input"}
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
			</div>
		</div>

		</>
	)

}
export default EntryForm