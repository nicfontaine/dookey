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
		mergeTagList: (state, action) => {
			state.value = { ...state.value, ...action.payload };
		},
		setTags: (state, action) => {
			state.value = { ...action.payload };
		},
		resetTags: () => initialState,
	},
});

export const {
	addTag,
	deleteTag,
	mergeTagList,
	setTags,
	resetTags,
} = tagsSlice.actions;

export default tagsSlice.reducer;