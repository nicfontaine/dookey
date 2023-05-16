import "../styles/global.css";
import "../styles/bonkr.css";
import "../styles/emoji-mart.css";

import React from "react";
import { store } from "../store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

let persistor = persistStore(store);

// This default export is required in a new `pages/_app.js` file.
export default function MyApp ({ Component, pageProps }) {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Component {...pageProps} />
			</PersistGate>
		</Provider>
	);
}

console.log(`APP_ENV: ${process.env.NEXT_PUBLIC_APP_ENV}
APP_VERSION ${process.env.NEXT_PUBLIC_APP_VERSION}`);