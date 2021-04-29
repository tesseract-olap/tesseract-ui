import {
  Explorer,
  explorerReducer,
  olapMiddleware,
  permalinkMiddleware
} from "@datawheel/tesseract-explorer";
import {createElement} from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {applyMiddleware, compose, createStore} from "redux";

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;
const enhancers = composeEnhancers(
  applyMiddleware(olapMiddleware, permalinkMiddleware)
);

const store = createStore(explorerReducer, undefined, enhancers);

const App = props =>
  createElement(Provider, {store},
    createElement(Explorer, {
      src: props.serverUrl
    })
  );

ReactDOM.render(
  createElement(App, {
    serverUrl: process.env.__SERVER_URL__
  }),
  document.getElementById("app")
);
