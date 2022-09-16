(function(){"use strict"})()

import { useEffect, useRef } from "react"
import autosize from "autosize"

const StatusBar = ({msg}) => {

	const statusBarRef = useRef(null)

	useEffect(() => {
		if (msg.length) {
			statusBarRef.current.classList.add("update")
		}
		statusBarRef.current.addEventListener("animationend", () => {
			statusBarRef.current.classList.remove("update")
		})
	}, [msg])

	return(
		<>
			<div className="status-bar" ref={statusBarRef}>
				<div className="status-bar-inner">
					{msg}
				</div>
			</div>

			<style jsx>{`
			`}</style>
		</>
	)

}

export default StatusBar