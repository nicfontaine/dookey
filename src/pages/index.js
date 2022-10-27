(function(){"use strict"})()

import { useState, useEffect, useRef } from "react"

import Head from "next/head"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGemoji from "remark-gemoji"

import { ArchiveIcon } from "@primer/octicons-react"

import EntryForm from "../components/EntryForm"
import Todo from "../components/Todo"
import StatusBar from "../components/StatusBar"
import DialogImport from "../components/DialogImport"
import CommandOptions from "../components/CommandOptions"
import DialogFileOpen from "../components/DialogFileOpen"
import introTemplate from "../mod/intro-template"
import entryCommands from "../mod/entry-commands"
import settingsDefault from "../mod/settings-default"

var activeIndex = -1

const TodoPage = () => {

  // Recoil
  // todoList, setTodoList, focusElement, setFocusElement, mainRef, todoListRef

  const [todoList, setTodoList] = useState([])
  const [tagList, setTagList] = useState({})
  const [settings, setSettings] = useState(settingsDefault)
  const [activeIndexPrevious, setActiveIndexPrevious] = useState(-1)

  const [focusElement, setFocusElement] = useState()

  const [statusMsg, setStatusMsg] = useState("")
  const [dialogImportShow, setDialogImportShow] = useState(false)
  const [commandOptionsDisplay, setCommandOptionsDisplay] = useState(false)
  const [fileOpenSelect, setFileOpenSelect] = useState(false)

  const mainRef = useRef(null)
  const mainHeadingRef = useRef(null)
  const entryFormRef = useRef(null)
  const todoListRef = useRef(null)

  const focusChange = (i) => {
    activeIndex = i
    if (activeIndex === -1) {
      setFocusElement(document.getElementById("entry-input"))
      todoListRef.current.scrollTop = 0
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
    let _list = JSON.parse(localStorage.getItem("todos"))
    if (_list) setTodoList(_list)
    let _tags = JSON.parse(localStorage.getItem("tags"))
    if (_tags) setTagList(_tags)
    let _settings = JSON.parse(localStorage.getItem("settings"))
    if (!_settings) _settings = introTemplate.settings
    setSettings(_settings)
    // Initialize with boilerplate how-to
    if ((!_list && !_tags) || (!_list.length && !Object.keys(_tags).length)) {
      setTodoList(introTemplate.todos)
      setTagList(introTemplate.tags)
    }
    // Set absolute backup path, from relative
    // Get absolute backups path
    ;(async () => {
      const response = await fetch("/api/set-backups-location", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({backups: _settings.backups})
      })
      const res = await response.json()
      if (res.err) {
        setStatusMsg(JSON.stringify(res.err))
        return;
      }
      setSettings({..._settings, backupsAbsolute: res.backupsAbsolute})
    })()
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
      let previous = todoListRef.current.getElementsByClassName("todo")[activeIndexPrevious]
      if (!previous) return;
      let details = previous.getElementsByTagName("details")
      for (const d of details) {
        if (activeIndex > -1 && activeIndex === activeIndexPrevious) {
          d.open = true
          d.classList.add("open")
        } else {
          d.open = false
          d.classList.remove("open")
        }
      }
    }
  }, [focusElement])

  // Settings changes
  useEffect(() => {
    mainRef.current.closest("html").style.fontSize = settings.fontSize + "px"
    entryCommands.center(settings.center)
    localStorage.setItem("settings", JSON.stringify(settings))
  }, [settings])

  const handleTodoList = {
    scroll(e) {
      if (e.target.scrollTop > 0) {
        mainHeadingRef.current.classList.add("scrolled")
        entryFormRef.current.classList.add("hide")
      } else {
        mainHeadingRef.current.classList.remove("scrolled")
        entryFormRef.current.classList.remove("hide")
      }
    }
  }

  const handleMain = {
    scrollDistance: 30,
    keyDown (e) {
      if (e.key === "ArrowDown") {
        if (e.ctrlKey && !e.shiftKey) todoListRef.current.scrollTop += handleMain.scrollDistance
      }
      else if (e.key === "ArrowUp") {
        if (e.ctrlKey && !e.shiftKey) todoListRef.current.scrollTop -= handleMain.scrollDistance
      }
    }
  }

  return (

    <>

      <Head>
        <title>{process.env.APP_NAME}</title>
      </Head>

      <div ref={mainRef} className="main-container" onKeyDown={handleMain.keyDown}>

        <div className="main">

          <div className="top-container">
            <div className="top-background-image"></div>

            <div className="main-heading" ref={mainHeadingRef}>
              <ReactMarkdown remarkPlugins={[remarkGemoji]}>{settings.title}</ReactMarkdown>
            </div>

            <div ref={entryFormRef}>
            <EntryForm
              todoListRef={todoListRef}
              setTodoList={setTodoList}
              setTagList={setTagList}
              todoList={todoList}
              tagList={tagList}
              activeIndex={activeIndex}
              setStatusMsg={setStatusMsg}
              commandOptionsDisplay={commandOptionsDisplay}
              setDialogImportShow={setDialogImportShow}
              setCommandOptionsDisplay={setCommandOptionsDisplay}
              setFileOpenSelect={setFileOpenSelect}
              setFocusElement={setFocusElement}
              goto={goto}
              settings={settings}
              setSettings={setSettings}
              settingsDefault={settingsDefault}
            />
            </div>

          </div>

          <CommandOptions
            commandOptionsDisplay={commandOptionsDisplay}
            settings={settings}
            tagList={tagList}
          />

          <div
            className={`todo-list scroll-shadows ${commandOptionsDisplay ? "blur" : ""}`}
            onScroll={handleTodoList.scroll}
            ref={todoListRef}
          >
            { todoList.length >= 1 ? todoList.map((todo, index) => {
              if (!todo.archive) {
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
                  todoListRef={todoListRef}
                />
              }
            }) : undefined }

            <div className="divider-archived">
              <ArchiveIcon size={16} className="icon"/>
              <span className="mg-l-3">Archived</span>
            </div>

            <div className="d-flx w-full flx-col">
            { todoList.length >= 1 ? todoList.map((todo, index) => {
              if (todo.archive) {
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
                  todoListRef={todoListRef}
                />
              }
            }) : undefined }
            </div>
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
          setSettings={setSettings}
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