import {
  Explorer,
  explorerReducer,
  olapMiddleware,
  permalinkMiddleware,
} from "@datawheel/tesseract-explorer";
import React from "react";
import ReactDOM from "react-dom";
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
  applyMiddleware(olapMiddleware, permalinkMiddleware)
);

const store = createStore(explorerReducer, {}, enhancers);

const App = (props) => {
  return React.createElement(
    Provider,
    { store: store },
    React.createElement(Explorer, {
      src: props.serverUrl,
      title: props.appTitle,
    })
  );
};

ReactDOM.render(
  React.createElement(App, {
    serverUrl: process.env.__SERVER_URL__,
    appTitle: process.env.__APP_TITLE__
  }),
  document.getElementById("app")
);
