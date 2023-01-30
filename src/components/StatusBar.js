import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import autosize from "autosize";
import { clearStatusMessage } from "../feature/statusMessageSlice";

const StatusBar = () => {
	const statusBarRef = useRef(null);
	const { message, delay } = useSelector((state) => state.statusMessage.value);
	const dispatch = useDispatch();

	useEffect(() => {
		// const abortController = new AbortController();
		if (message.length) {
			statusBarRef.current.classList.add("update");
			setTimeout(() => {
				dispatch(clearStatusMessage());
			}, delay | 5000);
		}
		statusBarRef.current.addEventListener("animationend", () => {
			statusBarRef.current.classList.remove("update");
		});
		// return () => {
		// 	abortController.abort();
		// };
	}, [message]);

	return (
		<>
			<div className="status-bar" ref={statusBarRef}>
				<div className="status-bar-inner">{message}</div>
			</div>

			<style jsx>{``}</style>
		</>
	);
};

export default StatusBar;
