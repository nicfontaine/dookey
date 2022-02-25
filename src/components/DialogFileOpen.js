(function(){"use strict"})()

import { useEffect, useRef } from "react"

import entryCommands from "../mod/entry-commands.js"

export default function DialogFileOpen({
	goto,
	setFocusElement,
	setStatusMsg,
	fileOpenSelect,
	setFileOpenSelect,
	setTodoList
}) {

	const input = useRef(null)

	useEffect(() => {
		if (fileOpenSelect) {
			setFocusElement(null)
			goto.exit()
			input.current.click()
			setFileOpenSelect(false)
		}
	}, [fileOpenSelect])
	
	const fileUpload = (e) => {
		let file = e.target.files[0]
		let reader = new FileReader()
		reader.addEventListener("load", (e) => {
			let list = JSON.parse(reader.result)
			setTodoList(list)
			setStatusMsg("Loaded from file")
		})
		reader.addEventListener("error", (e) => {
			setStatusMsg("Failed to read file")
		})
		reader.readAsText(file)
	}

	return(
		<>
			<div className="dialog-file-open">
				<input type="file" accept="json"
					ref={input}
					onChange={fileUpload}
				/>
			</div>

			<style jsx>{`
				.dialog-file-open {
					display: none;
				}
			`}</style>
		</>
	)

}