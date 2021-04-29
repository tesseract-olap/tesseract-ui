import {FocusStyleManager} from "@blueprintjs/core";
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {applyMiddleware, compose, createStore} from "redux";
import {
  DebugView,
  Explorer,
  explorerReducer,
  olapMiddleware,
  permalinkMiddleware,
  PivotView,
  TableView
} from "@datawheel/tesseract-explorer";

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;
const enhancers = composeEnhancers(
  applyMiddleware(permalinkMiddleware, olapMiddleware)
);

const store = createStore(explorerReducer, undefined, enhancers);

FocusStyleManager.onlyShowFocusOnTabs();

const PANELS = {
  "Data Table": TableView,
  "Pivot Table": PivotView,
  "Raw response": DebugView
};

ReactDOM.render(
  <Provider store={store}>
    <Explorer
      src="/olap/"
      formatters={{Sheep: n => `🐑 ${n.toFixed()}`}}
      multiquery
      panels={PANELS}
    />
  </Provider>,
  document.getElementById("app")
);
