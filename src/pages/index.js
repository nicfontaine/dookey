(function(){"use strict"})()

import { useState, useEffect, useRef } from "react"
import { v4 as uuid } from "uuid"
import csn from "classnames"
import autosize from "autosize"
import entryCommands from "../mod/entry-commands.js"

import Head from "next/head"
import EntryForm from "../components/EntryForm"
import Todo from "../components/Todo"
import StatusBar from "../components/StatusBar"
import DialogImport from "../components/DialogImport"
import CommandOptions from "../components/CommandOptions"
import DialogFileOpen from "../components/DialogFileOpen"

var activeIndex = -1

const TodoPage = () => {

  // Recoil
  // todoList, setTodoList, focusElement, setFocusElement, mainRef, todoListRef

  const [todoList, setTodoList] = useState([])
  const [tagList, setTagList] = useState({})

  const [focusElement, setFocusElement] = useState()

  const [statusMsg, setStatusMsg] = useState("")
  const [dialogImportShow, setDialogImportShow] = useState(false)
  const [commandOptionsDisplay, setCommandOptionsDisplay] = useState(false)
  const [fileOpenSelect, setFileOpenSelect] = useState(false)
  const [mainFontSize, setMainFontSize] = useState(16)

  const mainRef = useRef(null)
  const todoListRef = useRef(null)

  const [entryRef, setEntryRef] = useState()

  // Index focus change
  // mainRef, activeIndex, focusElement
  const goto = {
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
    index: (i) => {
      focusChange(i)
    },
    element: (e) => {
      activeIndex = null
      setFocusElement(e)
    }
  }

  const focusChange = (i) => {
    activeIndex = i
    if (activeIndex === -1 && entryRef) {
      setFocusElement(entryRef)
    } else if (activeIndex > -1) {
      if (activeIndex === 0) { todoListRef.current.scrollTop = 0 }
      let todos = mainRef.current.getElementsByClassName("todo-focus")
      setFocusElement(todos[activeIndex])
    }
  }

  // Load
  useEffect(() => {
    // LS - Todos, Tags
    let list = JSON.parse(localStorage.getItem("todos"))
    if (list) setTodoList(list)
    let tags = JSON.parse(localStorage.getItem("tags"))
    if (tags) setTagList(tags)
    // LS - Font size
    let fontSize = JSON.parse(localStorage.getItem("font-size"))
    if (fontSize) { setMainFontSize(fontSize) }
    document.body.tabIndex = -1
    document.body.addEventListener("focus", (e) => {
      console.log("Focus event on <body>")
    })
    // document.body.addEventListener("keyup", (e) => {
    // 	e.stopPropagation()
    // 	if (e.target !== document.body) {
    // 		console.log("not equal")
    // 		return;
    // 	}
    // 	if (e.key === "/") {
    // 		console.log("slash")
    // 		entryRef.focus()
    // 		goto.entry()
    // 	}
    // }, {passive: true})
  }, [])

  // Update Todo list (storage)
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todoList))
    focusChange(activeIndex)
    // let todos = mainRef.current.getElementsByClassName("todo-focus")
  }, [todoList])

  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify(tagList))
  }, [tagList])

  // Focus element
  useEffect(() => {
    if (focusElement) { focusElement.focus() }
  }, [focusElement])

  // Main font size change
  useEffect(() => {
    mainRef.current.closest("html").style.fontSize = mainFontSize + "px"
    localStorage.setItem("font-size", mainFontSize)
  }, [mainFontSize])

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
            todoList={todoList}
            tagList={tagList}
            activeIndex={activeIndex}
            setStatusMsg={setStatusMsg}
            commandOptionsDisplay={commandOptionsDisplay}
            setDialogImportShow={setDialogImportShow}
            setCommandOptionsDisplay={setCommandOptionsDisplay}
            setFileOpenSelect={setFileOpenSelect}
            setFocusElement={setFocusElement}
            setEntryRef={setEntryRef}
            goto={goto}
            setMainFontSize={setMainFontSize}
          />

          <CommandOptions
            commandOptionsDisplay={commandOptionsDisplay}
            mainFontSize={mainFontSize}
          />

          <div
            className={`todo-list ${commandOptionsDisplay ? "blur" : ""}`}
            ref={todoListRef}
          >
            { todoList.length >= 1 ? todoList.map((todo, index) => {
              return <Todo
                key={todo.id}
                todo={todo}
                index={index}
                activeIndex={activeIndex}
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