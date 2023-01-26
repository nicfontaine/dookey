import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import todosSlice, { addTodo } from "./todosSlice";
import { useDispatch } from "react-redux";

const initialState = {
	value: [],
};

export const archivesSlice = createSlice({
	name: "archives",
	initialState,
	reducers: {
		addArchive: (state, action) => {
			state.value.push(action.payload);
		},
		unshiftArchive: (state, action) => {
			state.value.unshift(action.payload);
		},
		deleteArchive: (state, action) => {
			const list = state.value.filter((archive) => archive.id !== action.payload.id);
			state.value = list;
		},
		setArchiveText: (state, action) => {
			const archive = state.value.find((archive) => archive.id === action.payload.id);
			archive.text = action.payload.text;
		},
		moveArchiveUp: (state, action) => {
			const i = action.payload;
			let list = state.value.map((t) => t);
			list.splice(i - 1, 0, list.splice(i, 1)[0]);
			state.value = list;
		},
		moveArchiveDown: (state, action) => {
			const i = action.payload;
			let list = state.value.map((t) => t);
			list.splice(i + 1, 0, list.splice(i, 1)[0]);
			state.value = list;
		},
		mergeArchiveList: (state, action) => {
			let _ids = [];
			state.value = [...state.value, ...action.payload].filter((archive) => {
				if (_ids.indexOf(archive.id) < 0) {
					_ids.push(archive.id);
					return archive;
				}
			});
		},
		setArchives: (state, action) => {
			state.value = [...action.payload];
		},
		resetArchives: () => initialState,
	},
});

export const {
	addArchive,
	unshiftArchive,
	moveArchiveUp,
	moveArchiveDown,
	deleteArchive,
	resetArchives,
	setArchiveText,
	mergeArchiveList,
	setArchives,
} = archivesSlice.actions;

export default archivesSlice.reducer;