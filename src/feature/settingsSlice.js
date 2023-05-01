import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	value: {
		version: process.env.NEXT_PUBLIC_APP_VERSION,
		title: "🗒️ Todo List",
		fontSize: 17,
		center: 850,
		density: "md",
		backups: "./backups/",
		syncFile: "",
		image: "/img/giphy-skyline-05.gif",
	},
};

export const settingsSlice = createSlice({

	name: "settings",
	initialState,
	reducers: {

		setFontSize: (state, action) => {
			state.value.fontSize = Number(action.payload);
		},

		setCenter: (state, action) => {
			state.value.center = action.payload;
		},

		setDensity: (state, action) => {
			state.value.density = action.payload;
		},

		setTitle: (state, action) => {
			state.value.title = action.payload;
		},

		setBackups: (state, action) => {
			state.value.backups = action.payload;
		},

		setBackupsAbsolute: (state, action) => {
			state.value.backupsAbsolute = action.payload;
		},

		setSyncFile: (state, action) => {
			state.value.syncFile = action.payload;
		},

		setImage: (state, action) => {
			state.value.image = action.payload;
		},

		mergeSettings: (state, action) => {
			state.value = { ...state.value, ...action.payload };
		},

		setSettings: (state, action) => {
			state.value = { ...action.payload };
		},

		resetSettings: () => initialState,

	},
});

export const {
	setFontSize,
	setCenter,
	setDensity,
	setTitle,
	setBackups,
	setBackupsAbsolute,
	setSyncFile,
	setImage,
	mergeSettings,
	setSettings,
	resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;