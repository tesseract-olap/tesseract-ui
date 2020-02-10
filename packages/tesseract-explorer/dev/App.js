import React from "react";
import {Provider} from "react-redux";
import {applyMiddleware, compose, createStore, combineReducers} from "redux";
import {
  Explorer,
  explorerInitialState,
  explorerReducer,
  olapMiddleware,
  permalinkMiddleware
} from "../src";

import "normalize.css/normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "@blueprintjs/table/lib/css/table.css";
import "react-perfect-scrollbar/dist/css/styles.css";
// import "../dist/explorer.css";

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;
const enhancers = composeEnhancers(
  applyMiddleware(permalinkMiddleware, olapMiddleware)
);

const initialState = {explorer: explorerInitialState()};
const rootReducer = combineReducers({explorer: explorerReducer});
const store = createStore(rootReducer, initialState, enhancers);

const App = () =>
  <Provider store={store}>
    <Explorer
      locale={["en", "es"]}
      src={process.env.APP_TESSERACT_URL}
      title={process.env.APP_TITLE}
    />
  </Provider>
;

export default App;
