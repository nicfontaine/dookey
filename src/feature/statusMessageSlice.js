import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
	value: {
		message: "",
		delay: 0,
	},
};

export const statusMessageSlice = createSlice({
	name: "statusMessage",
	initialState,
	reducers: {
		setStatusMessage: (state, action) => {
			state.value.message = action.payload[0];
			state.value.delay = action.payload[1];
		},
		clearStatusMessage: (state, action) => {
			state.value.message = "";
		},
	},
});

export const {
	setStatusMessage,
	clearStatusMessage,
} = statusMessageSlice.actions;

export default statusMessageSlice.reducer;