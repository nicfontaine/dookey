(function(){"use strict"})()

import { useState, useEffect, useRef } from "react"

import Head from "next/head"
import EntryForm from "../components/EntryForm"
import Todo from "../components/Todo"
import StatusBar from "../components/StatusBar"
import DialogImport from "../components/DialogImport"
import CommandOptions from "../components/CommandOptions"
import DialogFileOpen from "../components/DialogFileOpen"
import introTemplate from "../mod/intro-template"
import entryCommands from "../mod/entry-commands"

var activeIndex = -1

const TodoPage = () => {

  // Recoil
  // todoList, setTodoList, focusElement, setFocusElement, mainRef, todoListRef

  const [todoList, setTodoList] = useState([])
  const [tagList, setTagList] = useState({})
  const [settings, setSettings] = useState({fontSize: 17, center: null})
  const [activeIndexPrevious, setActiveIndexPrevious] = useState(-1)

  const [focusElement, setFocusElement] = useState()

  const [statusMsg, setStatusMsg] = useState("")
  const [dialogImportShow, setDialogImportShow] = useState(false)
  const [commandOptionsDisplay, setCommandOptionsDisplay] = useState(false)
  const [fileOpenSelect, setFileOpenSelect] = useState(false)

  const mainRef = useRef(null)
  const todoListRef = useRef(null)

  const focusChange = (i) => {
    activeIndex = i
    if (activeIndex === -1) {
      setFocusElement(document.getElementById("entry-input"))
    } else if (activeIndex > -1) {
      if (activeIndex === 0) { todoListRef.current.scrollTop = 0 }
      let todos = mainRef.current.getElementsByClassName("todo-focus")
      setFocusElement(todos[activeIndex])
    } else if (!i) {
      setFocusElement(null)
    }
  }

  // Index focus change
  // mainRef, activeIndex, focusElement
  const goto = {
    index: (i) => {
      setActiveIndexPrevious(activeIndex)
      focusChange(i)
    },
    next: () => {
      let todos = mainRef.current.getElementsByClassName("todo-focus")
      if (activeIndex === todos.length-1) { goto.entry() }
      else { goto.index(activeIndex+1) }
    },
    prev: () => {
      let todos = mainRef.current.getElementsByClassName("todo-focus")
      if (activeIndex === -1) { goto.index(todos.length-1) }
      else if (activeIndex === 0) { goto.entry() }
      else { goto.index(activeIndex-1)}
    },
    entry: () => {
      goto.index(-1)
    },
    exit: () => {
      goto.index(null)
    },
    element: (e) => {
      activeIndex = null
      setFocusElement(e)
    }
  }

  // Load
  useEffect(() => {
    // LS - Todos, Tags, Font-size
    let list = JSON.parse(localStorage.getItem("todos"))
    if (list) setTodoList(list)
    let tags = JSON.parse(localStorage.getItem("tags"))
    if (tags) setTagList(tags)
    let settings = JSON.parse(localStorage.getItem("settings"))
    if (settings) { setSettings(settings) }
    // Initialize with boilerplate how-to
    if ((!list && !tags) || (!list.length && !Object.keys(tags).length)) {
      console.log("no list no tags")
      setTodoList(introTemplate.todos)
      setTagList(introTemplate.tags)
    }
    document.body.tabIndex = -1
    document.body.addEventListener("focus", goto.exit)
    document.body.addEventListener("keyup", (e) => {
    	if (e.target === document.body && e.key === "/") {
        goto.entry()
      }
    })
  }, [])

  // Update Todo list (storage)
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todoList))
    focusChange(activeIndex)
  }, [todoList])

  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify(tagList))
  }, [tagList])

  // Focus element
  useEffect(() => {
    if (focusElement) focusElement.focus()
    if (activeIndexPrevious && activeIndexPrevious >= 0) {
      let details = todoListRef.current.getElementsByClassName("todo")[activeIndexPrevious].getElementsByTagName("details")
      for (const d of details) {
        if (activeIndex > -1 && activeIndex === activeIndexPrevious) {
          d.open = true
        } else { d.open = false }
      }
    }
  }, [focusElement])

  // Settings changes
  useEffect(() => {
    mainRef.current.closest("html").style.fontSize = settings.fontSize + "px"
    entryCommands.center(settings.center)
    localStorage.setItem("settings", JSON.stringify(settings))
  }, [settings])

  return (

    <>

      <Head>
        <title>DooKey</title>
      </Head>

      <div ref={mainRef} className="main-container">

        <div className="main">

          <EntryForm
            todoListRef={todoListRef}
            setTodoList={setTodoList}
            setTagList={setTagList}
            todoList={todoList}
            tagList={tagList}
            activeIndex={activeIndex}
            activeIndexPrevious={activeIndexPrevious}
            setActiveIndexPrevious={setActiveIndexPrevious}
            setStatusMsg={setStatusMsg}
            commandOptionsDisplay={commandOptionsDisplay}
            setDialogImportShow={setDialogImportShow}
            setCommandOptionsDisplay={setCommandOptionsDisplay}
            setFileOpenSelect={setFileOpenSelect}
            setFocusElement={setFocusElement}
            goto={goto}
            settings={settings}
            setSettings={setSettings}
          />

          <CommandOptions
            commandOptionsDisplay={commandOptionsDisplay}
            settings={settings}
          />

          <div
            className={`todo-list scroll-shadows ${commandOptionsDisplay ? "blur" : ""}`}
            ref={todoListRef}
          >
            { todoList.length >= 1 ? todoList.map((todo, index) => {
              return <Todo
                key={todo.id}
                todo={todo}
                index={index}
                activeIndex={activeIndex}
                activeIndexPrevious={activeIndexPrevious}
                setActiveIndexPrevious={setActiveIndexPrevious}
                todoList={todoList}
                setTodoList={setTodoList}
                tagList={tagList}
                setTagList={setTagList}
                goto={goto}
              />
            }) : undefined }
          </div>

        </div>

        <DialogImport
          goto={goto}
          todoList={todoList}
          setTodoList={setTodoList}
          tagList={tagList}
          setTagList={setTagList}
          setStatusMsg={setStatusMsg}
          dialogImportShow={dialogImportShow}
          setDialogImportShow={setDialogImportShow}
          setFocusElement={setFocusElement}
        />

        <DialogFileOpen
          setStatusMsg={setStatusMsg}
          fileOpenSelect={fileOpenSelect}
          setFileOpenSelect={setFileOpenSelect}
          setTodoList={setTodoList}
          setTagList={setTagList}
        />

        <StatusBar msg={statusMsg} />

      </div>

    </>

  )
}

export default TodoPage