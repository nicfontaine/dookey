import { useState, useEffect, useRef } from "react"
import { v4 as uuid } from 'uuid'
import TextArea from "textarea-autosize-reactjs"
import { useDispatch } from "react-redux"
import { setCenter, setTitle, setFontSize, setBackups } from "../feature/settingsSlice"
import { FlameIcon } from "@primer/octicons-react"
import EmojiPopup from "./EmojiPopup"

import entryCommands from "../mod/entry-commands.js"

const EntryForm = ({
	todoListRef,
	setTodoList,
	setTagList,
	todoList,
	tagList,
	activeIndex,
	setStatusMsg,
	commandOptionsDisplay,
	setDialogImportShow,
	setCommandOptionsDisplay,
	setFileOpenSelect,
	goto,
	settings,
	setSettings,
	settingsDefault,
	archiveList,
	setArchiveList
}) => {
	
	const dispatch = useDispatch()

	const [entryInput, setEntryInput] = useState("")
	const entryInputRef = useRef(null)
	const formRef = useRef(null)
	const [emojiPopupActive, setEmojiPopupActive] = useState(false)
	const [emojiKeyUpEvent, setEmojiKeyUpEvent] = useState("")
	const [emojiKeyDownEvent, setEmojiKeyDownEvent] = useState("")

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
		
		change(e) {
			e.preventDefault()
			// Ignore if a todo is focused
			if (activeIndex < 0) {
				let val = e.target.value
				setEntryInput(val)
				if (todoListRef.current.scrollTop > 0) todoListRef.current.scrollTop = 0
			}
		},

		active() {
			goto.entry()
			if (todoListRef.current) {
				todoListRef.current.scrollTop = 0
			}
		},

		focus(e) {},

		// In case focus leaves, but active doesn't change. Like to <body>
		blur(e) {
			// Changing windows/tabs doesn't really blur the input
			if (e.target !== document.activeElement) {
				formRef.current.classList.remove("active")
				entryInputRef.current.classList.remove("active")
			}
		},

		submit(e) {
			e.preventDefault()
		},

		keyDown(e) {
			setEmojiKeyDownEvent(e)
			if (emojiPopupActive) {
				if (e.key === "Enter" || e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Tab") {
					e.preventDefault()
					return;
				}
			}

			if (!e.shiftKey && e.key === "Enter") {
				e.preventDefault()
				handleEntryInput.confirm()
				return;
			} else if (e.shiftKey && e.key === "Enter") {
				// setEntryInput(entryInput + "\n")
				return;
			} else if (e.key === " ") {
				if (entryInput[0] === "/") {
					if (entryInput.trim().split("/")[1] === "backups") {
						setEntryInput(`${entryInput} ${settings.backups}`)
					}
				}
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
		},

		keyUp(e) {
			setEmojiKeyUpEvent(e)
		},

		// Clear content
		clear() {
			setEntryInput("")
		},

		// User entry
		confirm() {
			let val = entryInput.trim()
			if (!val.length) {
				handleEntryInput.clear()
				return;
			}
			// Commands
			if (val.indexOf("/") === 0) {
				// NOTE: Cleanup and move
				val = val.replace(/  +/g, ' ').substring(val.indexOf("/")+1, val.length)
				let command = val.substring(0, val.indexOf(" ")) || val
				let args = val.substring(val.indexOf(" ")+1, val.length).split(" ")
				if (command in entryCommands) {
					if (command === "msg") {
						entryCommands.msg(setStatusMsg, "test")
					} else if (command === "nuke") {
						entryCommands.nuke(setTodoList, setArchiveList, setTagList, setStatusMsg, setSettings, settingsDefault)
					} else if (command === "export") {
						entryCommands.export(todoList, tagList, settings, setStatusMsg, archiveList)
					} else if (command === "import") {
						setDialogImportShow(true)
					} else if (command === "save") {
						entryCommands.save(todoList, tagList, settings, setSettings, setStatusMsg)
					} else if (command === "open") {
						entryCommands.open(setFileOpenSelect)
					} else if (command === "kill") {
						entryCommands.kill(setStatusMsg)
					} else if (command === "help") {
						window.open(process.env.APP_HELP)
					} else if (command === "title") {
						let title = args.join(" ")
						setSettings({...settings, title: title })
						dispatch(setTitle(title))
					} else if (command === "full") {
						setSettings({...settings, center: null})
						dispatch(setCenter(null))
					} else if (command === "center") {
						if (args[0] !== undefined) {
							let size = args[0].trim()
							setSettings({...settings, center: size})
							dispatch(setCenter(size))
						}
					} else if (command === "size") {
						if (args[0] === undefined) return;
						let size = args[0].trim()
						if (size) {
							setSettings({...settings, fontSize: size })
							dispatch(setFontSize(size))
							// entryCommands.size(setMainFontSize, Number(size))
						}
					} else if (command === "backups") {
						if (!args) {
							setEntryInput(`${entryInput} ${settings.backupsAbsolute}`)
						}
						let location = args[0].trim()
						if (location) {
							setSettings({...settings, backups: location})
							dispatch(setBackups(location))
							entryCommands.backups(location, settings, setSettings, setStatusMsg)
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
		<div className={`entry-container ${commandOptionsDisplay ? "commands-display" : ""}`}>
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
						onKeyUp={handleEntryInput.keyUp}
						onClick={handleEntryInput.active}
						onFocus={handleEntryInput.focus}
						onBlur={handleEntryInput.blur}
						tabIndex="0"
						rows="1"
						autoFocus
						placeholder="Add a todo"
						ref={entryInputRef}
					>{entryInput}</TextArea>

					<EmojiPopup
						active={emojiPopupActive}
						setActive={setEmojiPopupActive}
						inputText={entryInput}
						setInputText={setEntryInput}
						keyUpEvent={emojiKeyUpEvent}
						keyDownEvent={emojiKeyDownEvent}
						listMax={8}
					>
					</EmojiPopup>

				</form>
			</div>
		</div>

		</>
	)

}
export default EntryForm