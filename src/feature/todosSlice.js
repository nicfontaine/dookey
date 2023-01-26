import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";
import { addArchive } from "./archivesSlice";

const initialState = {
	value: [],
};

export const todosSlice = createSlice({
	name: "todos",
	initialState,
	reducers: {
		addTodo: (state, action) => {
			state.value.push(action.payload);
		},
		setTodoText: (state, action) => {
			const todo = state.value.find((todo) => todo.id === action.payload.id);
			todo.text = action.payload.text;
		},
		setTodoTags: (state, action) => {
			const todo = state.value.find((todo) => todo.id === action.payload.id);
			if (todo) todo.tags = action.payload.tags;
		},
		moveTodo: (state, action) => {

		},
		archiveTodo: (state, action) => {
			addArchive(action.payload);
			// archiveTodo(action.payload);
		},
		deleteTodo: (state, action) => {
			state.value.splice(action.payload, 1);
		},
		mergeTodoList: (state, action) => {
			let _ids = [];
			state.value = [...state.value, ...action.payload].filter((todo) => {
				if (_ids.indexOf(todo.id) < 0) {
					_ids.push(todo.id);
					return todo;
				}
			});
		},
		setTodos: (state, action) => {
			state.value = [...action.payload];
		},
		resetTodos: () => initialState,
	},
});

export const {
	addTodo,
	setTodoTags,
	moveTodo,
	archiveTodo,
	deleteTodo,
	setTodoText,
	mergeTodoList,
	setTodos,
	resetTodos,
} = todosSlice.actions;

export default todosSlice.reducer;