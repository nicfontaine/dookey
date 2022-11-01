import { useState, useEffect } from "react"
import FuzzySearch from "fuzzy-search"
import { gemoji } from "gemoji"
import emojiSubstring from "../mod/emoji-substring"

const fuzzysearch = new FuzzySearch(gemoji, ["names"], {sort: true})
var index = 0

const EmojiPopup = ({
  active,
  setActive,
  inputText,
  setInputText,
  keyUpEvent,
  keyDownEvent
}) => {

  var listMax = 6
  const [emojiList, setEmojiList] = useState([])
  const [emojiSearchString, setEmojiSearchString] = useState("")
  const [emojiSelect, setEmojiSelect] = useState("")

  useEffect(() => {
    if (keyDownEvent) {
      keyDown(keyDownEvent)
    }
  }, [keyDownEvent])
  
  useEffect(() => {
    if (keyUpEvent) {
      keyUp(keyUpEvent)
    }
  }, [keyUpEvent])
  
  useEffect(() => {
    // console.log(inputText[inputText.length-1])
  }, [inputText])

  useEffect(() => {
    listEmojis(emojiSearchString)
  }, [emojiSearchString])

  useEffect(() => {
		if (emojiSelect) {
      setInputText(inputText.replace(`:${emojiSearchString}`, emojiSelect))
			setActive(false)
			setEmojiSearchString("")
		}
	}, [emojiSelect])

  const listEmojis = function(str) {
    let list = emojiList
    if (index > list.length) index = 0
    if (str && str.length) {
			let search = fuzzysearch.search(str).slice(0, listMax)
			if (search.length) list = search
			else list = []
		}
    list = list.map((s, i) => {
      s.active = i === index ? true : false
      return s
    })
    setEmojiList(list)
    return list
  }

  const list = {
    next() {
      let max = listMax < emojiList.length ? listMax : emojiList.length
      index = (index+1) % max
      listEmojis()
    },
    prev() {
      index--
      let max = listMax < emojiList.length ? listMax : emojiList.length
      index = index < 0 ? max-1 : index
      listEmojis()
    },
    select() {
      setEmojiSelect(emojiList[index].emoji)
    }
  }

  const keyDown = function(e) {
    const key = e.key
    if (active) {
      if (key === "ArrowUp") {
        list.prev()
      } else if (key === "ArrowDown") {
        list.next()
      } else if (key === "Enter" || key === "Tab") {
        list.select()
      }
    }
  }

  const keyUp = function(e) {
    const key = e.key
    const start = e.target.selectionStart-1
    var active = active
    var str = ""
    // Possible state change
    if (key === ":") {
      active = true
    } else if (key === " ") {
      active = false
    } else if (key === "Backspace") {
      if (inputText[start] === ":") {
        active = false
      }
    }
    str = emojiSubstring(inputText, start)
    active =  str.length ? true : false
    setEmojiSearchString(str)
    setActive(active)
  }

  const testKeycode = function(code) {
    if (code.match(/^[0-9a-z-_]+$/)) return true;
    return false;
  }

  return (
    <>
    	{active ? 
        <div className="emoji-list-container">
          <div className="emoji-list">
            { emojiList.length ? emojiList.map((emoji) => {
              return (
                <div className={`emoji-list-item ${emoji.active ? "active" : ""}`} key={emoji.emoji}>
                  <div className="emoji">{emoji.emoji}</div>
                  <code className="code">:{emoji.names.join(",")}</code>
                </div>
              )
            }) : <div className="emoji-list-item-null">{emojiSearchString.length ? "No matches found" : "type for emoji search..."}</div> }
          </div>
          <div className="emoji-list-how-to"><code>Up/Down</code> to change selection. <code>Enter</code> to select</div>
        </div>
      : null }
    </>
  )  
  
}

export default EmojiPopup