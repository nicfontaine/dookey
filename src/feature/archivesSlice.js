import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
		moveArchiveUp: (state, action) => {

		},
    moveArchiveDown: (state, action) => {

		},
		deleteArchive: (state, action) => {
			state.value.splice(action.payload, 1);
		},
	},
});

export const { addArchive, moveArchiveUp, moveArchiveDown, deleteArchive } = archivesSlice.actions;

export default archivesSlice.reducer;