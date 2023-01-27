import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
	value: {
		index: -1,
		indexPrevious: -1,
	},
};

export const itemFocusSlice = createSlice({
	name: "itemFocus",
	initialState,
	reducers: {
		setFocusIndex: (state, action) => {
			state.value.indexPrevious = state.value.index;
			state.value.index = action.payload;
		},
		setFocusIndexPrevious: (state, action) => {
			state.value.indexPrevious = action.payload;
		},
	},
});

export const {
	setFocusIndex,
	setFocusIndexPrevious,
} = itemFocusSlice.actions;

export default itemFocusSlice.reducer;