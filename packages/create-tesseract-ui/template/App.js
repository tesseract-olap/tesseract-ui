import {
  Explorer,
  explorerInitialState,
  explorerReducer,
  permalinkMiddleware,
  tesseractMiddleware
} from "@datawheel/tesseract-explorer";
import React from "react";
import {Provider} from "react-redux";
import {applyMiddleware, compose, createStore} from "redux";

import "normalize.css/normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "@blueprintjs/table/lib/css/table.css";
import "@datawheel/tesseract-explorer/dist/explorer.css";

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;
const enhancers = composeEnhancers(
  applyMiddleware(permalinkMiddleware, tesseractMiddleware)
);

const initialState = explorerInitialState();
const store = createStore(explorerReducer, initialState, enhancers);

function App() {
  return (
    <Provider store={store}>
      <Explorer src={process.env.APP_TESSERACT_URL} title={process.env.APP_TITLE} />
    </Provider>
  );
}

export default App;
