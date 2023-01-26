import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addTodo } from "./todosSlice";
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
		setArchiveText: (state, action) => {
			console.log(action.payload.id);
			const archive = state.value.find((archive) => archive.id === action.payload.id);
			archive.text = action.payload.text;
		},
		moveArchiveUp: (state, action) => {

		},
		moveArchiveDown: (state, action) => {

		},
		deleteArchive: (state, action) => {
			state.value.splice(action.payload, 1);
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
	moveArchiveUp,
	moveArchiveDown,
	deleteArchive,
	resetArchives,
	setArchiveText,
	mergeArchiveList,
	setArchives,
} = archivesSlice.actions;

export default archivesSlice.reducer;