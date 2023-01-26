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
		unshiftTodo: (state, action) => {
			state.value.unshift(action.payload);
		},
		insertTodoAt: (state, action) => {
			const { todo, index } = action.payload;
			let list = state.value.slice();
			list.splice(index, 0, todo);
			state.value = list;
		},
		deleteTodo: (state, action) => {
			const list = state.value.filter((todo) => todo.id !== action.payload.id);
			state.value = list;
		},
		setTodoText: (state, action) => {
			const todo = state.value.find((todo) => todo.id === action.payload.id);
			todo.text = action.payload.text;
		},
		setTodoTags: (state, action) => {
			const todo = state.value.find((todo) => todo.id === action.payload.id);
			if (todo) todo.tags = action.payload.tags;
		},
		moveTodoUp: (state, action) => {
			const i = action.payload;
			let list = state.value.map((t) => t);
			list.splice(i - 1, 0, list.splice(i, 1)[0]);
			state.value = list;
		},
		moveTodoDown: (state, action) => {
			const i = action.payload;
			let list = state.value.map((t) => t);
			list.splice(i + 1, 0, list.splice(i, 1)[0]);
			state.value = list;
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
	unshiftTodo,
	insertTodoAt,
	deleteTodo,
	setTodoTags,
	setTodoText,
	moveTodoUp,
	moveTodoDown,
	mergeTodoList,
	setTodos,
	resetTodos,
} = todosSlice.actions;

export default todosSlice.reducer;