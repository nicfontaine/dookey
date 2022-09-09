(function(){"use strict"})()

import { useState, useEffect, useRef } from "react"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import goto from "../mod/goto"

const EmojiPicker = ({
  entryInput,
  setEntryInput,
  activeIndex,
  activeIndexPrevious,
  setActiveIndexPrevious,
  pickerDisplay,
  setPickerDisplay
}) => {

    const handle = {
      enter(e) {
        setEntryInput(entryInput.substring(0, entryInput.length-1) + e.native)
        setPickerDisplay(false)
        goto.entry()
        // setActiveIndexPrevious(activeIndex)
        // goto.exit()
      }
    }
  
  return(
    <>
      
      <Picker
        onEmojiSelect={handle.enter}
      ></Picker>

    </>
  )

}

export default EmojiPicker