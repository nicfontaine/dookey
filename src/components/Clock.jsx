import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Time from "../util/time";

const Clock = ({ active, setActive }) => {

	const { clockHour } = useSelector((state) => state.settings.value);
	const [clockState, setClockState] = useState(["HH", "MM", "SS"]);
	const clockOuterRef = useRef(null);

	useEffect(() => {
		Time.createState(clockState, setClockState, clockHour);
	}, []);

	useEffect(() => {
		Time.setClockHour(clockHour);
	}, [clockHour]);

	const keyDown = function (e) {
		if (e.key === "Escape") {
			setActive(false);
			Time.stop();
			document.removeEventListener("keydown", keyDown);
			clockOuterRef.current.classList.remove("active");
		} else if (e.key === " ") {
			Time.pauseToggle();
		}
	};

	useEffect(() => {
		if (active) {
			Time.start();
			document.addEventListener("keydown", keyDown);
			clockOuterRef.current.classList.add("active");
		}
	}, [active]);

	return (
		<>
			<div className="clock-outer" ref={clockOuterRef}>
				{ active &&
						<div className="clock-inner">
							<div className="clock-time">
								<div className="clock-h">{clockState[0]}</div>
								<div className="clock-m">{clockState[1]}</div>
								<div className="clock-s">{clockState[2]}</div>
							</div>
							<div className="clock-msg"><code>ESC</code> to close</div>
						</div>
				}
			</div>
		</>
	);

};

Clock.propTypes = {
	active: PropTypes.bool,
	setActive: PropTypes.func,
};

export default Clock;