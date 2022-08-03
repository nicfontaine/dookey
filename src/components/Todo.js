// (function(){"use strict"})()

import { useState, useEffect, useRef } from "react"
import csn from "classnames"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkGemoji from "remark-gemoji"
import TodoInput from "./TodoInput"

var deleteStore = []

const Todo = ({
  todo,
  index,
  activeIndex,
  setTodoList,
  todoList,
  goto
}) => {

  const [editIndex, setEditIndex] = useState(null)
  const [deleteIndex, setDeleteIndex] = useState(null)
  const [activeIndexPrevious, setActiveIndexPrevious] = useState(-1)

  var dragged = false
  var mX
  var mY

  const move = {
    up: () => {
      if (activeIndex > 0) {
        let _list = todoList.map((todo) => todo)
        _list.splice(activeIndex - 1, 0, _list.splice(activeIndex, 1)[0])
        // console.log("activeIndex " + activeIndex)
        setTodoList(_list)
      }
    },
    down: () => {
      if (activeIndex < todoList.length-1) {
        let _list = todoList.map((todo) => todo)
        _list.splice(activeIndex + 1, 0, _list.splice(activeIndex, 1)[0])
        // console.log("activeIndex " + activeIndex)
        setTodoList(_list)
      }
    }
  }

  const handleTodo = {

    // Set active todo to edit mode
    edit: (e) => {
      setEditIndex(index)
      setActiveIndexPrevious(activeIndex)
      goto.index(index)
    },

    // Mark task for delete
    delete: (e) => {
      e.target.style.height = e.target.getBoundingClientRect().height + "px"
      setDeleteIndex(activeIndex)
      deleteStore.push({todo: todoList[activeIndex], index})
      setTimeout(() => handleTodo.remove(activeIndex), 150)
    },

    // Remove from data, and list. Set next active position
    remove: (_ind) => {
      // Remove from todo list
      let _list = todoList.filter((todo, index) => {
        if (index !== _ind) { return todo }
      })
      setDeleteIndex(null)
      handleTodo.postDeleteIndex(_list)
      // NOTE: not working, when list is empty
      setTodoList(_list)
    },

    // Update activeIndex after deletion, based on number of other tasks
    postDeleteIndex: (_newTodoList) => {
      // Check if activeIndex Needs to change
      let newIndex = activeIndex
      if (activeIndex > -1) {
        // No todos. Go to entry
        if (!_newTodoList.length) {
          newIndex = -1
        }
        // At end, up 1
        else if (activeIndex === _newTodoList.length) {
          newIndex = activeIndex - 1
        }
        goto.index(newIndex)
        // Else, stay on same line
      }
    },

    focus: (e, index) => {
      // NOTE: r-click is focusing, so we'll just change the index as well
      // NOTE: This is messing up when moving todos, and focusing the old place
      // goto.index(index)
      // e.target.classList.add("active")
      // console.log("Todo: " + index + " has been focused")
    },

    // Click to activate todo
    click: (e, index) => {
      // Already selected - edit mode
      goto.index(index)
      if (!dragged && activeIndex === index) {
        // setEditIndex(index)
      } else {
        setEditIndex(null)
      }
      dragged = false
    },

    // Track if click+dragging, so user can copy todo w/o editing
    mouseDown: (e) => {
      mX = e.clientX
      mY = e.clientY
    },

    mouseUp: (e) => {
      if (e.clientX !== mX && e.clientY !== mY) {
        dragged = true
      } else {
        dragged = false
      }
    },

    keyDown: (e) => {
      if (!e.target.classList.contains("todo")) {
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault()
        handleTodo.edit(e)
      }
      else if (e.key === "Delete" || e.key === "d") {
        e.preventDefault()
        handleTodo.delete(e)
      }
      else if (e.key === "e") {
        e.preventDefault()
        handleTodo.edit(e)
      }
      else if (e.key === "/") {
        e.preventDefault()
        goto.index(-1)
      }
      else if (e.key === "ArrowDown") {
        e.preventDefault()
        // Move todo
        if (e.shiftKey && e.ctrlKey) {
          move.down()
        }
        goto.next()
      }
      else if (e.key === "ArrowUp") {
        e.preventDefault
        // Move todo
        if (e.shiftKey && e.ctrlKey) {
          move.up()
        }
        goto.prev()
      }
      else if (e.key === "z" && e.ctrlKey) {
        if (!deleteStore.length) {
          return;
        }
        let _td = deleteStore.pop()
        let _list = todoList.map((todo) => todo)
        _list.splice(_td.index, 0, _td.todo)
        goto.index(_td.index)
        setTodoList(_list)
      }
      else if (e.key === "Tab") {
        e.preventDefault()
        if (e.shiftKey) {
          goto.prev()
        } else {
          goto.next()
        }
      }
      else if (e.key === "Home") {
        e.preventDefault()
        goto.index(0)
      }
      else if (e.key === "End") {
        e.preventDefault()
        goto.index(todoList.length-1)
      }

    }

  }

  if (index === editIndex) {

    return (
      <TodoInput 
        todo={todo}
        index={index}
        todoList={todoList}
        goto={goto}
        setTodoList={setTodoList}
        editIndex={editIndex}
        setEditIndex={setEditIndex}
        activeIndexPrevious={activeIndexPrevious}
      />
    )

  }
  else {

    let isDelete = index === deleteIndex
    let isActive = index === activeIndex

    return(
      <button
        className={csn("todo todo-focus",
        {delete:isDelete},
        {active:isActive})}
        onClick={(e) => handleTodo.click(e, index)}
        onFocus={(e) => handleTodo.focus(e, index)}
        onMouseDown={handleTodo.mouseDown}
        onMouseUp={handleTodo.mouseUp}
        onKeyDown={handleTodo.keyDown}
        autoFocus={todo.active}
        tabIndex="0"
      >
        {<span className="todo-index">{index+1}</span>}
        {/*{<span className="todo-index">{(index+10).toString(36)}</span>}*/}
        <div className="todo-text">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkGemoji]}>{todo.text}</ReactMarkdown>
        </div>
      </button>
    )

  }

}

export default Todo