import { useState, useEffect, useRef } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import remarkGemoji from "remark-gemoji";
import { ArchiveIcon } from "@primer/octicons-react";
import EntryForm from "../components/EntryForm";
import Todo from "../components/Todo";
import StatusBar from "../components/StatusBar";
import DialogImport from "../components/DialogImport";
import EntryCommandOptions from "../components/EntryCommandOptions";
import DialogFileOpen from "../components/DialogFileOpen";
import introTemplate from "../util/intro-template";
import { focusItemIndex, focusTodoOrArchive, setTodos } from "../feature/todosSlice";
import { setTags } from "../feature/tagsSlice";
import { setSettings } from "../feature/settingsSlice";
import { setStatusMessage } from "../feature/statusMessageSlice";
import resolveBackupPath from "../util/resolve-backup-path";

const TodoPage = () => {

	const dispatch = useDispatch();
	const todoList = useSelector((state) => state.todos.value.todos);
	const archiveList = useSelector((state) => state.todos.value.archives);
	const tagList = useSelector((state) => state.tags.value);
	const settings = useSelector((state) => state.settings.value);
	const focusIndex = useSelector((state) => state.todos.value.focusIndex);
	const itemIndexWidth = Number((todoList.length + archiveList.length).toString().length) * 10;
	
	const [dialogImportShow, setDialogImportShow] = useState(false);
	const [commandOptionsDisplay, setCommandOptionsDisplay] = useState(false);
	const [fileOpenSelect, setFileOpenSelect] = useState(false);

	const mainRef = useRef(null);
	const mainHeadingRef = useRef(null);
	const entryInputRef = useRef(null);
	const todoListRef = useRef(null);

	useEffect(() => {
		if (focusIndex === -1) {
			entryInputRef.current.focus();
			todoListRef.current.scrollTop = 0;
		} else if (focusIndex !== null) {
			// dispatch(focusTodoOrArchive(focusIndex));
			// const todos = document.getElementsByClassName("focus-group-todo");
			// todos[focusIndex].focus();
		}
	}, [focusIndex]);

	const backups = async function () {
		const backupsAbsolute = await resolveBackupPath(settings);
		dispatch(setSettings({ ...settings, backupsAbsolute }));
	};

	// Load
	useEffect(() => {
		// Initialize, if starting fresh
		if (!todoList.length && !tagList.length) {
			batch(() => {
				dispatch(setTodos(introTemplate.todos));
				dispatch(setTags(introTemplate.tags));
				dispatch(setSettings(introTemplate.settings));
			});
		}
		if (settings) backups();
		document.body.tabIndex = -1;
		window.addEventListener("keydown", (e) => {
			if (e.target === document.body) {
				if (e.key === "/" || (e.key === "l" && e.ctrlKey)) {
					e.preventDefault();
					dispatch(focusItemIndex(-1));
				}
			}
		});
	}, []);

	// Settings changes for page styling
	useEffect(() => {
		mainRef.current.closest("html").style.fontSize = settings.fontSize + "px";
		if (settings.center && Number(settings.center) > 0) {
			document.querySelector(":root").style.setProperty("--main-center-width", `${settings.center}px`);
		}
		if (settings.image) {
			const img = document.getElementById("top-background-image");
			img.style.background = `url(${settings.image})`;
			img.style.backgroundPosition = "center";
			img.style.backgroundSize = "cover";
		}
	}, [settings]);

	// Scroll main list up/down with shortcuts
	const handleMain = {
		scrollDistance: 30,
		keyDown (e) {
			if (e.key === "ArrowDown") {
				if (e.ctrlKey && !e.shiftKey) todoListRef.current.scrollTop += handleMain.scrollDistance;
			} else if (e.key === "ArrowUp") {
				if (e.ctrlKey && !e.shiftKey) todoListRef.current.scrollTop -= handleMain.scrollDistance;
			}
		},
	};

	return (

		<>

			<Head>
				<title>{process.env.APP_NAME}</title>
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v2"></link>
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v2"></link>
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v2"></link>
				<link rel="manifest" href="/site.webmanifest"></link>
			</Head>

			<div
				ref={mainRef}
				className={`main-container ${settings.center ? "center" : ""}`}
				onKeyDown={handleMain.keyDown}
			>

				<div className="main">

					<div className="top-container">

						<div id="top-background-image"></div>

						<div
							className={`main-heading ${!settings.title ? "no-title" : ""}`}
							ref={mainHeadingRef}
						>
							<ReactMarkdown remarkPlugins={[remarkGemoji]}>{settings.title}</ReactMarkdown>
						</div>

						<div>
							<EntryForm
								entryInputRef={entryInputRef}
								todoListRef={todoListRef}
								commandOptionsDisplay={commandOptionsDisplay}
								setDialogImportShow={setDialogImportShow}
								setCommandOptionsDisplay={setCommandOptionsDisplay}
								setFileOpenSelect={setFileOpenSelect}
							/>
						</div>

					</div>

					<EntryCommandOptions
						commandOptionsDisplay={commandOptionsDisplay}
					/>

					<div
						className={`todo-list scroll-shadows ${commandOptionsDisplay ? "blur" : ""}`}
						ref={todoListRef}
					>
						<div className="todo-list-inner">
							{ todoList && todoList.length >= 1 ? todoList.map((todo, index) => {
								return <Todo
									key={todo.id}
									todo={todo}
									index={index}
									archived={false}
									itemIndexWidth={itemIndexWidth}
								/>;
							}) : undefined }
						</div>

						{ archiveList && archiveList.length ?
							<div className="divider-archived">
								<ArchiveIcon size={16} className="icon"/>
								<span className="mg-l-3">Archived</span>
							</div>
							: null }

						<div className="todo-list-inner">
							{ archiveList && archiveList.length ? archiveList.map((todo, index) => {
								return <Todo
									key={todo.id}
									todo={todo}
									index={index + todoList.length}
									archived={true}
									itemIndexWidth={itemIndexWidth}
								/>;
							}) : null }
						</div>

					</div>

				</div>

				<DialogImport
					dialogImportShow={dialogImportShow}
					setDialogImportShow={setDialogImportShow}
				/>

				<DialogFileOpen
					fileOpenSelect={fileOpenSelect}
					setFileOpenSelect={setFileOpenSelect}
				/>

				<StatusBar />

			</div>

			<style jsx>{`
				.todo-index {
					width: 
				}
			`}</style>

		</>

	);
};

export default TodoPage;