import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

import todosReducer from "/src/feature/todosSlice";
import tagsReducer from "/src/feature/tagsSlice";
import settingsReducer from "/src/feature/settingsSlice";
import statusMessageReducer from "../feature/statusMessageSlice";

const reducers = combineReducers({
	settings: settingsReducer,
	todos: todosReducer,
	tags: tagsReducer,
	statusMessage: statusMessageReducer,
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