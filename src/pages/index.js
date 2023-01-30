import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import setBackups from "../util/set-backups";
import { setFocusIndex } from "../feature/itemFocusSlice";
import { setTodos } from "../feature/todosSlice";
import { setTags } from "../feature/tagsSlice";
import { setSettings } from "../feature/settingsSlice";
import { setStatusMessage } from "../feature/statusMessageSlice";

const TodoPage = () => {

	const dispatch = useDispatch();
	const todoList = useSelector((state) => state.todos.value);
	const archiveList = useSelector((state) => state.archives.value);
	const tagList = useSelector((state) => state.tags.value);
	const settings = useSelector((state) => state.settings.value);
	const itemFocus = useSelector((state) => state.itemFocus.value);
	
	const [focusElement, setFocusElement] = useState();
	const [dialogImportShow, setDialogImportShow] = useState(false);
	const [commandOptionsDisplay, setCommandOptionsDisplay] = useState(false);
	const [fileOpenSelect, setFileOpenSelect] = useState(false);

	const mainRef = useRef(null);
	const mainHeadingRef = useRef(null);
	const entryInputRef = useRef(null);
	const todoListRef = useRef(null);

	// TODO: Need?
	// useEffect(() => {
	// 	goto.index(itemFocus.index);
	// }, [todoList]);

	// Focus element state change
	useEffect(() => {
		if (focusElement) focusElement.focus();
	}, [focusElement]);

	// Focus index state change - determine element
	useEffect(() => {
		if (itemFocus.index < 1) todoListRef.current.scrollTop = 0;
		if (itemFocus.index === -1) {
			setFocusElement(entryInputRef.current);
		} else if (itemFocus.index > -1) {
			// TODO: Cleanup, store in list or something
			let todos = mainRef.current.getElementsByClassName("todo-focus");
			setFocusElement(todos[itemFocus.index]);
		} else if (!itemFocus.index) {
			setFocusElement(null);
		}
	}, [itemFocus.index]);

	// Index focus change. mainRef, itemFocus.index, setFocusIndex
	const goto = {
		index (i) {
			dispatch(setFocusIndex(i));
		},
		next () {
			let todos = mainRef.current.getElementsByClassName("todo-focus");
			if (itemFocus.index === todos.length - 1) {
				goto.entry(); 
			} else {
				goto.index(itemFocus.index + 1); 
			}
		},
		prev () {
			let todos = mainRef.current.getElementsByClassName("todo-focus");
			if (itemFocus.index === -1) {
				goto.index(todos.length - 1); 
			} else if (itemFocus.index === 0) {
				goto.entry(); 
			} else {
				goto.index(itemFocus.index - 1);
			}
		},
		entry () {
			console.log(itemFocus.index);
			goto.index(-1);
		},
		exit () {
			goto.index(null);
		},
	};

	const backups = async function () {
		const res = await setBackups(settings);
		if (res.err) {
			dispatch(setStatusMessage(JSON.stringify(res.err)));
			return;
		}
		dispatch(setSettings(res));
	};

	// Load
	useEffect(() => {
		// Initialize, if starting fresh
		if (!todoList.length && !tagList.length) {
			dispatch(setTodos(introTemplate.todos));
			dispatch(setTags(introTemplate.tags));
			dispatch(setSettings(introTemplate.settings));
		}
		if (settings) backups();
		document.body.tabIndex = -1;
		// NOTE: This is causing a ref error at line 54
		document.body.addEventListener("focus", goto.exit);
		document.body.addEventListener("keyup", (e) => {
			if (e.target === document.body) {
				if (e.key === "/" || (e.key === "l" && e.ctrlKey)) {
					goto.entry();
				}
			}
		});
	}, []);

	// Settings changes for page styling
	useEffect(() => {
		mainRef.current.closest("html").style.fontSize = settings.fontSize + "px";
		if (settings.center && Number(settings.center) > 0) {
			document.querySelector(":root").style.setProperty("--main-center-width", `${settings.center}px`);
			document.body.classList.add("center");
		} else {
			document.body.classList.remove("center");
		}
		if (!settings.title.length) {
			mainHeadingRef.current.classList.add("scrolled");
		} else {
			mainHeadingRef.current.classList.remove("scrolled");
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
			</Head>

			<div ref={mainRef} className="main-container" onKeyDown={handleMain.keyDown}>

				<div className="main">

					<div className="top-container">

						<div className="top-background-image"></div>

						<div className="main-heading" ref={mainHeadingRef}>
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
								goto={goto}
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
							{ todoList.length >= 1 ? todoList.map((todo, index) => {
								return <Todo
									key={todo.id}
									todo={todo}
									index={index}
									archived={false}
									goto={goto}
								/>;
							}) : undefined }
						</div>

						{ archiveList.length ?
							<div className="divider-archived">
								<ArchiveIcon size={16} className="icon"/>
								<span className="mg-l-3">Archived</span>
							</div>
							: null }

						<div className="todo-list-inner">
							{ archiveList.length ? archiveList.map((todo, index) => {
								return <Todo
									key={todo.id}
									todo={todo}
									index={index + todoList.length}
									archived={true}
									goto={goto}
								/>;
							}) : null }
						</div>

					</div>

				</div>

				<DialogImport
					goto={goto}
					dialogImportShow={dialogImportShow}
					setDialogImportShow={setDialogImportShow}
					setFocusElement={setFocusElement}
				/>

				<DialogFileOpen
					fileOpenSelect={fileOpenSelect}
					setFileOpenSelect={setFileOpenSelect}
				/>

				<StatusBar />

			</div>

		</>

	);
};

export default TodoPage;