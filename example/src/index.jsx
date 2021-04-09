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

import "normalize.css/normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "@blueprintjs/table/lib/css/table.css";
import "@datawheel/tesseract-explorer/dist/explorer.css";
import "./style.css";

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
      title="Tesseract UI BETA"
      panels={PANELS}
      formatters={{
        Sheep: n => `🐑 ${n.toFixed()}`
      }}
    />
  </Provider>,
  document.getElementById("app")
);
