(function(){"use strict"})()

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
	value: { fontSize: 17, center: 850, title: "🗒️ Todo List" }
}

export const settingsSlice = createSlice({
	name: "tags",
	initialState,
	reducers: {
		setFontSize: (state, action) => {
			state.value.title = action.payload
		},
		setCenter: (state, action) => {
			state.value.center = action.payload
		},
		setTitle: (state, action) => {
			state.value.fontSize = action.payload
		},
		setBackups: (state, action) => {
			state.value.backups = action.payload
		}
	}
})

export const { setFontSize, setCenter, setTitle, setBackups } = settingsSlice.actions

export default settingsSlice.reducer