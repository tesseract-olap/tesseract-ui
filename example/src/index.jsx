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
import "normalize.css";

import Vizbuilder from "@datawheel/tesseract-vizbuilder";

const VizbuilderPanel = props =>
  <Vizbuilder
    cube={props.cube}
    result={props.result}
    params={props.params}
    allowedChartTypes={["barchart", "barchartyear", "lineplot", "stacked", "treemap", "geomap", "donut"]}
    downloadFormats={["svg", "png"]}
    showConfidenceInt={false}
  />;

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;
const enhancers = composeEnhancers(
  applyMiddleware(permalinkMiddleware, olapMiddleware)
);

const store = createStore(explorerReducer, undefined, enhancers);

const PANELS = {
  "Data Table": TableView,
  "Pivot Table": PivotView,
  "Raw response": DebugView,
  "Vizbuilder": VizbuilderPanel
};

ReactDOM.render(
  <Provider store={store}>
    <Explorer
      src="/olap/"
      formatters={{Sheep: n => `🐑 ${n.toFixed()}`}}
      multiquery
      previewLimit={75}
      panels={PANELS}
    />
  </Provider>,
  document.getElementById("app")
);
