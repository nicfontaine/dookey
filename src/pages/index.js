(function(){"use strict"})()

import { useState, useEffect, useRef } from "react"
import { v4 as uuid } from "uuid"
import csn from "classnames"
import autosize from "autosize"
import entryCommands from "../mod/entry-commands.js"
// import twrp from "./scripts/table-wrap.js"

// import { TodoProvider } from "../TodoContext.js"
// import { TodoContext } from "../TodoContext.js"
import Head from "next/head"
import EntryForm from "../components/EntryForm"
import Todo from "../components/Todo"
import StatusBar from "../components/StatusBar"
import DialogImport from "../components/DialogImport"
import CommandOptions from "../components/CommandOptions"
import DialogFileOpen from "../components/DialogFileOpen"

var activeIndex = -1

const TodoPage = () => {

  // const { todoList, setTodoList, activeIndex, setActiveIndex, activeIndexPrevious, setActiveIndexPrevious } = useContext(TodoContext)
  const [todoList, setTodoList] = useState([])
  const [deleteIndex, setDeleteIndex] = useState(null)
  const [editIndex, setEditIndex] = useState(null)
  const [activeIndexPrevious, setActiveIndexPrevious] = useState(-1)
  const [focusElement, setFocusElement] = useState()

  const [statusMsg, setStatusMsg] = useState("")
  const [dialogImportShow, setDialogImportShow] = useState(false)
  const [commandOptionsDisplay, setCommandOptionsDisplay] = useState(false)
  const [fileOpenSelect, setFileOpenSelect] = useState(false)

  const mainRef = useRef(null)
  const todoListRef = useRef(null)

  // const [todoRefs, setTodoRefs] = useState([])
  const [entryRef, setEntryRef] = useState()

  // Index focus change
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
    index: (i) => {
      focusChange(i)
    },
    exit: () => {
      goto.index(null)
    }
  }

  const focusChange = (i) => {
    activeIndex = i
    if (activeIndex === -1 && entryRef) {
      setFocusElement(entryRef)
    } else if (activeIndex > -1) {
      let todos = mainRef.current.getElementsByClassName("todo-focus")
      setFocusElement(todos[activeIndex])
    }
  }

  // Load
  useEffect(() => {
    let list = JSON.parse(localStorage.getItem("todos"))
    if (list) { setTodoList(list) }
    document.body.tabIndex = -1
    document.getElementsByTagName("body")[0].addEventListener("focus", (e) => {
      console.log("Focus event on <body>")
    })
  }, [])

  // Update Todo list (storage)
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todoList))
    setDeleteIndex(null)
    focusChange(activeIndex)
    let todos = mainRef.current.getElementsByClassName("todo-focus")
  }, [todoList])

  // Focus element
  useEffect(() => {
    if (focusElement) { focusElement.focus() }
  }, [focusElement])

  return (

    <>

      <Head>
        <title>DooKey</title>
      </Head>

      <div className="main-container"
        ref={mainRef}
      >

        <div className="main">

          <EntryForm
            todoListRef={todoListRef}
            setTodoList={setTodoList}
            todoList={todoList}
            activeIndex={activeIndex}
            setStatusMsg={setStatusMsg}
            setDialogImportShow={setDialogImportShow}
            setCommandOptionsDisplay={setCommandOptionsDisplay}
            setFileOpenSelect={setFileOpenSelect}
            setFocusElement={setFocusElement}
            setEntryRef={setEntryRef}
            goto={goto}
          />

          <CommandOptions
            commandOptionsDisplay={commandOptionsDisplay}
          />

          {/* Todo List */}
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
                activeIndexPrevious={activeIndexPrevious}
                setActiveIndexPrevious={setActiveIndexPrevious}
                goto={goto}
                deleteIndex={deleteIndex}
                setDeleteIndex={setDeleteIndex}
                editIndex={editIndex}
                setEditIndex={setEditIndex}
              />
            }) : undefined }
          </div>

        </div>

        <DialogImport
          goto={goto}
          todoList={todoList}
          setTodoList={setTodoList}
          activeIndex={activeIndex}
          setStatusMsg={setStatusMsg}
          dialogImportShow={dialogImportShow}
          setDialogImportShow={setDialogImportShow}
          setFocusElement={setFocusElement}
        />

        <DialogFileOpen
          goto={goto}
          setFocusElement={setFocusElement}
          setStatusMsg={setStatusMsg}
          fileOpenSelect={fileOpenSelect}
          setFileOpenSelect={setFileOpenSelect}
          setTodoList={setTodoList}
        />

        <StatusBar msg={statusMsg} />

      </div>

    </>

  )
}

export default TodoPage