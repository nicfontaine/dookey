(function(){"use strict"})()

import { useState, useEffect, useRef, forwardRef } from "react"

import entryCommands from "../mod/entry-commands.js"

const DialogImport = ({
	goto,
	todoList,
	setTodoList,
	setStatusMsg,
	dialogImportShow,
	setDialogImportShow
}) => {

	const importInput = useRef(null)
  const importDialog = useRef(null)
  const importDialogStatusText = useRef(null)

  useEffect(() => {
  	if (dialogImportShow) {
  		handleImport.show()
  	} else {
  		handleImport.hide()
  	}
  }, [dialogImportShow])

	// Todo list import dialog
	const handleImport = {

		hide: () => {
		  importInput.current.value = ""
		  goto.entry()
		},

		show: () => {
			goto.element(importInput.current)
			entryCommands.import(importDialog, importInput, importDialogStatusText)
		},
	  
	  submit: (e) => {
	    e.preventDefault()
	    let val = importInput.current.value
	    if (val !== undefined && val.length) {
	      try {
	        val = JSON.parse(val)
	        setDialogImportShow(false)
	        let _ids = []
	        setStatusMsg("Imported")
	        entryCommands.statusClearDelay(setStatusMsg, 2000)
	        // Combine w/ existing. Reject duplicates
	        // NOTE: move to 'combiner' function
	        let _list = [...todoList,...val].filter((todo) => {
	          if (_ids.indexOf(todo.id) < 0) {
	            _ids.push(todo.id)
	            return todo
	          }
	        })
	        setTodoList(_list)
	      } catch(err) {
	        importDialogStatusText.current.innerHTML = err
	      }
	    }
	  },

	  keyDown: (e) => {
	    // "ESC"
	    if (e.key === "Escape") {
	    	e.preventDefault()
	    	setDialogImportShow(false)
	    }
	    if (e.key === "Tab") {
	      e.preventDefault()
	    }
	  }

	}

	return(
		<>
		<div id="dialog-import"
			className={`dialog ${dialogImportShow && "active"}`}
			ref={importDialog}
		>
		  <div className="inner w-full w-mx-300">
		    <h3 className="mg-t-0 mg-b-3 text-center">Paste Your Input</h3>
		    <form onSubmit={handleImport.submit}>
		      <input
		        className="import-input w-full"
		        ref={importInput}
		        onKeyDown={handleImport.keyDown}
		      />
		    </form>
		    <div ref={importDialogStatusText}></div>
		  </div>
		</div>
		<style jsx>{`
			.dialog {
				z-index: 20;
			}
		`}</style>
		</>
	)

}

export default DialogImport