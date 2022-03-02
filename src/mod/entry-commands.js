(function(){"use strict"})()

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

  export: (todoList, setStatusMsg) => {
    navigator.clipboard.writeText(JSON.stringify(todoList))
    setStatusMsg("Copied to clipboard")
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

  size: (target, args) => {
    let size = args.split(" ")[0]
    if (size) {
      localStorage.setItem("font-size", size)
      target.current.closest("html").style.fontSize = size + "px"
    }
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