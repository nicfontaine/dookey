import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

import todosReducer from "/src/feature/todosSlice";
import archivesReducer from "/src/feature/archivesSlice";
import tagsReducer from "/src/feature/tagsSlice";
import settingsReducer from "/src/feature/settingsSlice";
import itemFocusReducer from "../feature/itemFocusSlice";

const reducers = combineReducers({
	todos: todosReducer,
	archives: archivesReducer,
	tags: tagsReducer,
	settings: settingsReducer,
	itemFocus: itemFocusReducer,
});

const persistConfig = {
	key: "root",
	version: 1,
	storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});