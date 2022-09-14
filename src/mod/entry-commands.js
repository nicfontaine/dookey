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
  nuke: (setTodoList, setTagList, setStatusMsg) => {
    setTodoList([])
    setTagList({})
    setStatusMsg("Todo list cleared")
    entryCommands.statusClearDelay(setStatusMsg, 4000)
  },

  export: async (todos, tags, setStatusMsg) => {
    let txt = JSON.stringify({todos, tags })
    if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
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
    }
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

  center(size) {
    if (size && Number(size) > 0) {
      document.querySelector(":root").style.setProperty("--main-center-width", `${size}px`)
      document.body.classList.add("center")
    } else {
      document.body.classList.remove("center")
    }
  },

  save: async (todos, tags, setStatusMsg) => {
    const response = await fetch("/api/backup", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({todos, tags})
    })
    const res = await response.json()
    if (res.err) { setStatusMsg(res.err) }
    setStatusMsg("Saved to: " + res.path)
    entryCommands.statusClearDelay(setStatusMsg, 4000)
  },

  async kill(setStatusMsg) {
    // console.log("kill")
    // const response = await fetch("/api/process-kill", {
    //   method: "POST",
    //   headers: {"Content-Type": "application/json"},
    //   body: JSON.stringify({})
    // })
    // const res = await response.json()
    // if (res.err) setStatusMsg(res.err)
  }

}

export default entryCommands