

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
	value: {},
};

export const tagsSlice = createSlice({
	name: "tags",
	initialState,
	reducers: {
		addTag: (state, action) => {
			state.value = { ...state.value, ...action.payload };
		},
		deleteTag: (state, action) => {
			// state.value.splice(action.payload, 1)
		},
	},
});

export const { addTag, deleteTag } = tagsSlice.actions;

export default tagsSlice.reducer;