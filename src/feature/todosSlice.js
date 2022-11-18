

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
		moveTodo: (state, action) => {

		},
		archiveTodo: (state, action) => {
			
		},
		deleteTodo: (state, action) => {
			state.value.splice(action.payload, 1);
		},
	},
});

export const { addTodo, moveTodo, archiveTodo, deleteTodo } = todosSlice.actions;

export default todosSlice.reducer;