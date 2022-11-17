import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import Time from "../mod/time"

const Clock = ({ active, setActive }) => {

  const keyDown = function(e) {
    if (e.key === "Escape") {
      console.log("ESC")
      setActive(false)
      document.removeEventListener("keydown", keyDown)
    }
  }

  useEffect(() => {
    if (active) {
      document.addEventListener("keydown", keyDown)
    }
  }, [active])

  const [clockState, setClockState] = useState([])

  const time = new Time(clockState, setClockState)
  time.start()

  return (
    <>
      { active &&
        <div className="clock-outer">
          <div className="clock-inner">
            <div className="clock-time">
              <div className="clock-h">{clockState[0]}</div>
              <div className="clock-m">{clockState[1]}</div>
              <div className="clock-s">{clockState[2]}</div>
            </div>
            <div className="clock-msg"><code>ESC</code> to close</div>
          </div>
        </div>
      }
      </>
  )

}

Clock.propTypes = {
  active: PropTypes.bool,
  setActive: PropTypes.func
}

export default Clock