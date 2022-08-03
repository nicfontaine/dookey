(function(){"use strict"})()
import { writeText } from "@tauri-apps/api/clipboard"

const entryCommands = {

  // Generic message. Not implemented
  msg: (setStatusMsg, msg) => {
    setStatusMsg(msg)
    entryCommands.statusClearDelay(setStatusMsg, 4000)
  },

  statusClearDelay: (set, time) => {
    setTimeout(() => set(""), time)
  },

  // NOTE: Should have a cleaner way to not have to pass these, or something
  nuke: (setTodoList, setStatusMsg) => {
    setTodoList([])
    setStatusMsg("Todo list cleared")
    entryCommands.statusClearDelay(setStatusMsg, 4000)
  },

  export: async (todoList, setStatusMsg) => {
    let txt = JSON.stringify(todoList)
    if ("clipboard" in navigator) {
      navigator.clipboard.writeText(txt)
      setStatusMsg("Copied to clipboard (navigator)")
    } else if (window.__TAURI__) {
      await writeText(txt)
      setStatusMsg("Copied to clipboard (tauri)")
    } else {
      setStatusMsg("Failed to copy to clipboard")
    }
    entryCommands.statusClearDelay(setStatusMsg, 4000)
  },

  import: (importDialog, importInput, importDialogStatusText) => {
    importDialogStatusText.current.innerHTML = ""
    importInput.current.focus()
  },

  // Open saved backup
  open: (setFileOpenSelect) => {
    setFileOpenSelect(true)
  },

  size: (setMainFontSize, size) => {
    setMainFontSize(size)
  },

  save: async (todoList, setStatusMsg) => {
    let list = todoList.map((todo) => {
      return { text: todo.text, id: todo.id }
    })
    const response = await fetch("/api/backup", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(list)
    })
    const res = await response.json()
    if (res.err) { setStatusMsg(err) }
    setStatusMsg("Saved to: " + res.path)
    entryCommands.statusClearDelay(setStatusMsg, 4000)
  }

}

export default entryCommands