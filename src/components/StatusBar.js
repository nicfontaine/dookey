(function(){"use strict"})()

import { useEffect, useRef } from "react"
import autosize from "autosize"

const StatusBar = ({msg}) => {

	const statusBarRef = useRef(null)

	useEffect(() => {
		if (msg.length) {
			statusBarRef.current.classList.add("update")
		}
		setTimeout(() => {
			statusBarRef.current.classList.remove("update")
		}, 500)
	}, [msg])

	return(
		<>
			<div className="status-bar" ref={statusBarRef}>
				<div className="status-bar-inner">
					{msg}
				</div>
			</div>

			<style jsx>{`
			  .status-bar {
			    padding: 0.8em 2rem;
					background: #131313;
					font-family: "PT Mono", monospace;
					font-size: 0.8rem;
					color: #aaa;
					transition: all 0.05s;
					min-height: 2.3rem;
					position: relative;
					z-index: 15;
			  }
			  .status-bar.update {
			  	animation: flash 1 500ms;
			  }
			  @keyframes flash {
			    0% { color: #aaa; background: #151515; }
			    25% { color: #fff; background: #000; }
			    50% { color: #aaa; background: #151515; }
			    75% { color: #fff; background: #000; }
			    100% { color: #aaa; background: #151515; }
			  }
			  .status-bar-inner {
			  	padding-left: 1.2rem;
			  }
			  .status-bar-inner:before {
			  	content: ">";
			  	transform: translateX(-200%);
			  	position: absolute;
			  	color: #777;
			  }
			`}</style>
		</>
	)

}

export default StatusBar