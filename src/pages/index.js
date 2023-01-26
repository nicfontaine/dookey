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
import entryCommands from "../util/entry-commands";
import introTemplate from "../util/intro-template";
import settingsDefault from "../util/settings-default";
import { setFocusIndexPrevious } from "../feature/itemFocusSlice";
import GoTo from "../util/goto.js";

var activeIndex = -1;

const TodoPage = () => {

	const dispatch = useDispatch();

	const todoList = useSelector((state) => state.todos.value);
	const archiveList = useSelector((state) => state.archives.value);
	const settings = useSelector((state) => state.settings.value);
	const itemFocus = useSelector((state) => state.itemFocus.value);
	
	const [focusElement, setFocusElement] = useState();
	GoTo.setFocusElement = setFocusElement;

	const [statusMsg, setStatusMsg] = useState("");
	const [dialogImportShow, setDialogImportShow] = useState(false);
	const [commandOptionsDisplay, setCommandOptionsDisplay] = useState(false);
	const [fileOpenSelect, setFileOpenSelect] = useState(false);

	const mainRef = useRef(null);
	const mainHeadingRef = useRef(null);
	const entryInputRef = useRef(null);
	const todoListRef = useRef(null);

	// setFocusElement(), activeIndex =
	const focusChange = {
		
		element (e) {
			activeIndex = null;
			setFocusElement(e);
		},
		
		index (i) {
			activeIndex = i;
			if (activeIndex < 1) todoListRef.current.scrollTop = 0;
			if (activeIndex === -1) {
				setFocusElement(entryInputRef.current);
			} else if (activeIndex > -1) {
				// TODO: Cleanup
				let todos = mainRef.current.getElementsByClassName("todo-focus");
				setFocusElement(todos[activeIndex]);
			} else if (!i) {
				setFocusElement(null);
			}
		},

	};

	// Index focus change. mainRef, activeIndex, focusElement
	// focusChange(), setFocusIndexPrevious() , setFocusElement()
	const goto = {
		index (i) {
			dispatch(setFocusIndexPrevious(activeIndex));
			focusChange.index(i);
		},
		element (e) {
			focusChange.element(e);
		},
		next () {
			let todos = mainRef.current.getElementsByClassName("todo-focus");
			if (activeIndex === todos.length - 1) {
				goto.entry(); 
			} else {
				goto.index(activeIndex + 1); 
			}
		},
		prev () {
			let todos = mainRef.current.getElementsByClassName("todo-focus");
			if (activeIndex === -1) {
				goto.index(todos.length - 1); 
			} else if (activeIndex === 0) {
				goto.entry(); 
			} else {
				goto.index(activeIndex - 1);
			}
		},
		entry () {
			goto.index(-1);
		},
		exit () {
			goto.index(null);
		},
	};

	// Load
	useEffect(() => {
		// TODO: Check settings, insert introTemplate settings, todos, tags
		// let _settings = JSON.parse(localStorage.getItem("settings"));
		// if (!_settings) _settings = introTemplate.settings;
		// // Initialize with boilerplate how-to
		// if ((!_todos && !_tags) || (!_todos.length && !Object.keys(_tags).length)) {
		// 	setTodoList(introTemplate.todos);
		// 	setTagList(introTemplate.tags);
		// }
		// Set absolute backup path, from relative, Get absolute backups path
		// (async () => {
		// 	const response = await fetch("/api/set-backups-location", {
		// 		method: "POST",
		// 		headers: { "Content-Type": "application/json" },
		// 		body: JSON.stringify({ backups: _settings.backups }),
		// 	});
		// 	const res = await response.json();
		// 	if (res.err) {
		// 		setStatusMsg(JSON.stringify(res.err));
		// 		return;
		// 	}
		// 	setSettings({ ..._settings, backupsAbsolute: res.backupsAbsolute });
		// })();
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

	useEffect(() => {
		goto.index(activeIndex);
	}, [todoList]);

	// Focus element
	useEffect(() => {
		if (focusElement) focusElement.focus();
	}, [focusElement]);

	// Settings changes
	useEffect(() => {
		mainRef.current.closest("html").style.fontSize = settings.fontSize + "px";
		entryCommands.center(settings.center);
		localStorage.setItem("settings", JSON.stringify(settings));
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
								activeIndex={activeIndex}
								setStatusMsg={setStatusMsg}
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
									activeIndex={activeIndex}
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
							{ archiveList.length ?
								archiveList.map((todo, index) => {
									return <Todo
										key={todo.id}
										todo={todo}
										index={index + todoList.length}
										archived={true}
										activeIndex={activeIndex}
										goto={goto}
									/>;
								})
								: null }
						</div>

					</div>

				</div>

				<DialogImport
					goto={goto}
					setStatusMsg={setStatusMsg}
					dialogImportShow={dialogImportShow}
					setDialogImportShow={setDialogImportShow}
					setFocusElement={setFocusElement}
				/>

				<DialogFileOpen
					setStatusMsg={setStatusMsg}
					fileOpenSelect={fileOpenSelect}
					setFileOpenSelect={setFileOpenSelect}
				/>

				<StatusBar msg={statusMsg} />

			</div>

		</>

	);
};

export default TodoPage;