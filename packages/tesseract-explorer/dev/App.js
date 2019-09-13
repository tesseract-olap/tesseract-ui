import React from "react";
import {Provider} from "react-redux";
import {applyMiddleware, compose, createStore} from "redux";
import {
  Explorer,
  explorerInitialState,
  explorerReducer,
  olapMiddleware,
  permalinkMiddleware
} from "../dist/explorer.esm";

import "normalize.css/normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "@blueprintjs/table/lib/css/table.css";
import "../dist/explorer.css";

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;
const enhancers = composeEnhancers(
  applyMiddleware(permalinkMiddleware, olapMiddleware)
);

const initialState = explorerInitialState();
const store = createStore(explorerReducer, initialState, enhancers);

function App() {
  return (
    <Provider store={store}>
      <Explorer locale={["en", "es"]} src="https://chilecube.datachile.io/" />
    </Provider>
  );
}

export default App;
