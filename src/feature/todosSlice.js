import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";

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
		setTodoTags: (state, action) => {
			const todo = state.value.find((todo) => todo.id === action.payload.id);
			if (todo) todo.tags = action.payload.tags;
		},
		moveTodo: (state, action) => {

		},
		archiveTodo: (state, action) => {
			
		},
		deleteTodo: (state, action) => {
			state.value.splice(action.payload, 1);
		},
	},
});

export const { addTodo, setTodoTags, moveTodo, archiveTodo, deleteTodo } = todosSlice.actions;

export default todosSlice.reducer;