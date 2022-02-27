// (function(){"use strict"})()

import { useState, useEffect, useRef } from "react"
import csn from "classnames"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import autosize from "autosize"

var deleteStore = []

const Todo = ({
  todo,
  index,
  activeIndex,
  setTodoList,
  todoList,
  goto
}) => {

  const [editTextSaved, setEditTextSaved] = useState("")
  const [editIndex, setEditIndex] = useState(null)
  const [deleteIndex, setDeleteIndex] = useState(null)
  const [todoInputText, setTodoInputText] = useState(todo.text)
  const [activeIndexPrevious, setActiveIndexPrevious] = useState(-1)

  const todoRef = useRef(null)
  const todoInputRef = useRef(null)

  var dragged = false
  var mX
  var mY

  const move = {
    up: () => {
      if (activeIndex > 0) {
        let _list = todoList.map((todo) => todo)
        _list.splice(activeIndex - 1, 0, _list.splice(activeIndex, 1)[0])
        // goto.prev()
        setTodoList(_list)
      }
    },
    down: () => {
      if (activeIndex < todoList.length-1) {
        let _list = todoList.map((todo) => todo)
        _list.splice(activeIndex + 1, 0, _list.splice(activeIndex, 1)[0])
        // goto.next()
        setTodoList(_list)
      }
    }
  }

  const handleTodo = {

    // Set active todo to edit mode
    edit: (e) => {
      setEditIndex(index)
      setEditTextSaved(todoList[activeIndex].text)
      setActiveIndexPrevious(activeIndex)
      goto.index(index)
    },

    // Mark task for delete
    delete: (e) => {
      e.target.style.height = e.target.offsetHeight + "px"
      setDeleteIndex(activeIndex)
      deleteStore.push([todoList[activeIndex], index])
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
      setDeleteIndex(null)
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
      // e.target.classList.add("active")
      // console.log("Todo: " + index + " has been focused")
    },

    // Click to activate todo
    click: (e, index) => {
      // Already selected - edit mode
      goto.index(index)
      if (!dragged && activeIndex === index) {
        setEditIndex(index)
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
      if (e.key === "Delete" || e.key === "d") {
        e.preventDefault()
        handleTodo.delete(e)
      }
      if (e.key === "e") {
        e.preventDefault()
        handleTodo.edit(e)
      }
      if (e.key === "/") {
        e.preventDefault()
        goto.index(-1)
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        // Move todo
        if (e.shiftKey && e.ctrlKey) {
          move.down()
        }
        goto.next()
      } else if (e.key === "ArrowUp") {
        e.preventDefault
        // Move todo
        if (e.shiftKey && e.ctrlKey) {
          move.up()
        }
        goto.prev()
      }

      if (e.ctrlKey && e.key === "z") {
        if (!deleteStore.length) {
          return;
        }
        let _td = deleteStore.pop()
        let _list = todoList.map((todo) => todo)
        _list.splice(_td.index, 0, _td.todo)
        goto.index(_td.index)
        setTodoList(_list)
      }
      if (e.key === "Tab") {
        e.preventDefault()
        if (e.shiftKey) {
          goto.prev()
        } else {
          goto.next()
        }
      }

    }

  }

  // Todo edit input
  const handleTodoInput = {

    // Input value change
    change: (e) => {
      setTodoInputText(e.target.value)
      e.target.style.minHeight = e.target.scrollHeight + "px"
      // autosize.update(e.target)
    },

    focus: (e) => {
      // Move cursor to end
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = e.target.value.length
      }, 0)
      e.target.style.minHeight = e.target.scrollHeight + "px"
      // autosize(e.target)
      // autosize.update(e.target)
    },

    blur: (e) => {
      handleTodoInput.unEdit(e)
    },

    unEdit: (e) => {
      setEditIndex(null)
      let _list = todoList
      let val = e.target.value
      _list = _list.map((todo, index) => {
        if (index === activeIndexPrevious) {
          todo.text = val
        }
        return todo
      }).filter((todo) => {
        if (todo.text.length) {
          return todo
        }
      })
      goto.index(activeIndexPrevious)
      setTodoList(_list)
    },

    // Handle special keys like enter, escape, etc
    keyDown: (e) => {
      // "ESC"
      if (e.key === "Escape") {
        e.preventDefault()
        setTodoList(todoList.map((todo, index) => {
          if (index === editIndex) {
            todo.text = editTextSaved
          }
          return todo
        }))
        goto.index(activeIndexPrevious)
        setEditIndex(null)
      }
      // Unedit, or carraige return
      if (e.key === "Enter") {
        if (e.ctrlKey) {
          e.preventDefault()
          handleTodoInput.unEdit(e)
        } else {
          // e.target.value += "\n"
          autosize.update(e.target)
        }
      }
      if (e.key === "Tab") {
        e.preventDefault()
        // NOTE: would be nice to have tabbed entry functionality
      }
    }
  }

  if (index === editIndex) {

    return (
      <textarea className="todo-input todo-focus" type="text"
        value={todoInputText}
        onChange={handleTodoInput.change}
        onKeyDown={handleTodoInput.keyDown}
        onFocus={handleTodoInput.focus}
        onBlur={handleTodoInput.blur}
        autoFocus
        tabIndex="0"
        ref={todoRef}
        rows="1"
      ></textarea>
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
        ref={todoRef}
      >
        {<span className="todo-index">{index+1}</span>}
        {/*{<span className="todo-index">{(index+10).toString(36)}</span>}*/}
        <pre className="todo-text">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{todo.text}</ReactMarkdown>
        </pre>
      </button>
    )

  }

}

export default Todo