(function(){"use strict"})()

import { useEffect, useRef } from "react"

import entryCommands from "../mod/entry-commands.js"

export default function DialogFileOpen({
	setStatusMsg,
	fileOpenSelect,
	setFileOpenSelect,
	setTodoList,
	setTagList
}) {

	const input = useRef(null)

	useEffect(() => {
		if (fileOpenSelect) {
			input.current.click()
			setFileOpenSelect(false)
		}
	}, [fileOpenSelect])
	
	const fileUpload = (e) => {
		let file = e.target.files[0]
		if (!file) return
		let reader = new FileReader()
		reader.addEventListener("load", (e) => {
			let { todos, tags} = JSON.parse(reader.result)
			setTodoList(todos)
			setTagList(tags)
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