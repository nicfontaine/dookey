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
import { focusItemIndex, setTodos } from "../feature/todosSlice";
import { setTags } from "../feature/tagsSlice";
import { setBackupsAbsolute, setSettings } from "../feature/settingsSlice";
import resolveBackupPath from "../util/resolve-backup-path";
import DialogFileSync from "../components/DialogFileSync";
import { setStatusMessage } from "../feature/statusMessageSlice";

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
	const [fileSyncSelect, setFileSyncSelect] = useState(false);

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

	// TODO: This should invalidate our settings backups if not found, so we can sync across devices, insead of clearing it on save
	const backups = async function () {
		const backupsAbsolute = await resolveBackupPath(settings.backups);
		if (backupsAbsolute.err) {
			dispatch(setStatusMessage(["Error resolving path", 5000]));
			return;
		}
		dispatch(setBackupsAbsolute(backupsAbsolute));
	};

	// Load
	useEffect(() => {
		// Initialize, if starting fresh
		if (!todoList.length && !tagList.length) {
			batch(() => {
				dispatch(setTodos(introTemplate.todos));
				dispatch(setTags(introTemplate.tags));
				dispatch(setSettings(introTemplate.settings));
				// console.log(introTemplate.settings);
			});
		}
		if (settings) backups();
		document.body.tabIndex = -1;
		window.addEventListener("keydown", (e) => {
			const ctrl = e.ctrlKey || e.metaKey;
			if (e.target === document.body) {
				if (e.key === "/" || (e.key === "l" && ctrl)) {
					e.preventDefault();
					dispatch(focusItemIndex(-1));
				}
			}
		});
	}, []);

	const topImageUpdate = async function () {
		const imgfile = await fetch(settings.image);
		const img = document.getElementById("top-background-image");
		if (!imgfile.ok) {
			img.style.background = undefined;
		} else {
			img.style.background = `url(${settings.image})`;
			img.style.backgroundPosition = "center";
			img.style.backgroundSize = "cover";
		}
	};

	// Settings changes for page styling
	useEffect(() => {
		topImageUpdate();
	}, [settings.image]);
	useEffect(() => {
		mainRef.current.closest("html").style.fontSize = settings.fontSize + "px";
		if (settings.center && Number(settings.center) > 0) {
			document.querySelector(":root").style.setProperty("--main-center-width", `${settings.center}px`);
		}
	}, [settings]);
	useEffect(() => {
		if (settings.density) {
			for (const d of ["sm", "md", "lg"]) {
				mainRef.current.classList.remove(`density-${d}`);
				mainRef.current.classList.add(`density-${settings.density}`);
			}
		}
	}, [settings.density]);

	// Scroll main list up/down with shortcuts
	const handleMain = {
		scrollDistance: 30,
		keyDown (e) {
			const ctrl = e.ctrlKey || e.metaKey;
			if (ctrl && !e.shiftKey) {
				if (e.key === "ArrowDown") {
					todoListRef.current.scrollTop += handleMain.scrollDistance;
				} else if (e.key === "ArrowUp") {
					todoListRef.current.scrollTop -= handleMain.scrollDistance;
				}
			}
		},
	};

	return (

		<>

			<Head>
				<title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v2"></link>
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v2"></link>
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v2"></link>
				<link rel="manifest" href="/site.webmanifest"></link>
			</Head>

			<div
				ref={mainRef}
				id="main-container"
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
								setFileSyncSelect={setFileSyncSelect}
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

				<DialogFileSync
					fileSyncSelect={fileSyncSelect}
					setFileSyncSelect={setFileSyncSelect}
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