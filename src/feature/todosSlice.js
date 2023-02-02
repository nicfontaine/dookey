import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	value: {
		todos: [],
		archives: [],
	},
};

export const todosSlice = createSlice({
	
	name: "todos",
	initialState,
	reducers: {

		// Todos
		unshiftTodo: (state, action) => {
			state.value.todos.unshift(action.payload);
		},

		addTodo: (state, action) => {
			state.value.todos.push(action.payload);
		},

		focusTodo: (state, action) => {
			todosSlice.caseReducers.focusOut(state, action);
			state.value.todos[action.payload].focus = true;
		},

		insertTodoAt: (state, action) => {
			const { todo, index } = action.payload;
			let list = state.value.todos.slice();
			list.splice(index, 0, todo);
			state.value.todos = list;
		},

		archiveTodo: (state, action) => {
			todosSlice.caseReducers.unshiftArchive(state, action);
			todosSlice.caseReducers.deleteTodo(state, action);
		},

		deleteTodo: (state, action) => {
			const list = state.value.todos.filter((todo) => todo.id !== action.payload.id);
			state.value.todos = list;
		},

		setTodoText: (state, action) => {
			const todo = state.value.todos.find((todo) => todo.id === action.payload.id);
			todo.text = action.payload.text;
		},

		setTodoTags: (state, action) => {
			const todo = state.value.todos.find((todo) => todo.id === action.payload.id);
			if (todo) todo.tags = action.payload.tags;
		},

		moveTodoUp: (state, action) => {
			const i = action.payload;
			let list = state.value.todos.map((t) => t);
			list.splice(i - 1, 0, list.splice(i, 1)[0]);
			state.value.todos = list;
		},

		moveTodoDown: (state, action) => {
			const i = action.payload;
			let list = state.value.todos.map((t) => t);
			list.splice(i + 1, 0, list.splice(i, 1)[0]);
			state.value.todos = list;
		},

		mergeTodoList: (state, action) => {
			let _ids = [];
			state.value.todos = [...state.value.todos, ...action.payload].filter((todo) => {
				if (_ids.indexOf(todo.id) < 0) {
					_ids.push(todo.id);
					return todo;
				}
			});
		},

		setTodos: (state, action) => {
			state.value.todos = [...action.payload];
		},

		resetTodos: (state, action) => {
			state.value.todos = initialState.value.todos;
		},

		// Archives
		addArchive: (state, action) => {
			state.value.archives.push(action.payload);
		},

		unshiftArchive: (state, action) => {
			state.value.archives.unshift(action.payload);
		},

		focusArchive: (state, action) => {
			todosSlice.caseReducers.focusOut(state, action);
			state.value.archives[action.payload].focus = true;
		},

		unArchive: (state, action) => {
			todosSlice.caseReducers.deleteArchive(state, action);
			todosSlice.caseReducers.addTodo(state, action);
		},

		deleteArchive: (state, action) => {
			const list = state.value.archives.filter((archive) => archive.id !== action.payload.id);
			state.value.archives = list;
		},

		setArchiveText: (state, action) => {
			const archive = state.value.archives.find((archive) => archive.id === action.payload.id);
			archive.text = action.payload.text;
		},

		moveArchiveUp: (state, action) => {
			const i = action.payload;
			let list = state.value.archives.map((t) => t);
			list.splice(i - 1, 0, list.splice(i, 1)[0]);
			state.value.archives = list;
		},

		moveArchiveDown: (state, action) => {
			const i = action.payload;
			let list = state.value.archives.map((t) => t);
			list.splice(i + 1, 0, list.splice(i, 1)[0]);
			state.value.archives = list;
		},

		mergeArchiveList: (state, action) => {
			let _ids = [];
			state.value.archives = [...state.value.archives, ...action.payload].filter((archive) => {
				if (_ids.indexOf(archive.id) < 0) {
					_ids.push(archive.id);
					return archive;
				}
			});
		},

		setArchives: (state, action) => {
			state.value.archives = [...action.payload];
		},

		resetArchives: (state, action) => {
			state.value.archives = initialState.value.archives;
		},

		focusOut: (state, action) => {
			state.value.todos.map((todo) => {
				todo.focus = false;
				return todo;
			});
			state.value.archives.map((todo) => {
				todo.focus = false;
				return todo;
			});
		},

		focusTodoOrArchive: (state, action) => {
			const i = action.payload;
			const tl = state.value.todos.length;
			todosSlice.caseReducers.focusOut(state, action);
			if (i >= tl) {
				state.value.archives[i - tl].focus = true;
			} else {
				state.value.todos[i].focus = true;
			}
		},

	},
});

export const {
	addTodo,
	unshiftTodo,
	insertTodoAt,
	focusTodo,
	archiveTodo,
	deleteTodo,
	setTodoTags,
	setTodoText,
	moveTodoUp,
	moveTodoDown,
	mergeTodoList,
	setTodos,
	resetTodos,
	addArchive,
	focusArchive,
	unshiftArchive,
	moveArchiveUp,
	moveArchiveDown,
	unArchive,
	deleteArchive,
	resetArchives,
	setArchiveText,
	mergeArchiveList,
	setArchives,
	focusTodoOrArchive,
	focusOut,
} = todosSlice.actions;

export default todosSlice.reducer;