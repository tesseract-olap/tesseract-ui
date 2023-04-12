// @ts-check
import {DebugView, Explorer, PivotView, TableView} from "@datawheel/tesseract-explorer";
import Vizbuilder from "@datawheel/tesseract-vizbuilder";
import React from "react";
import ReactDOM from "react-dom";

import "normalize.css";

const formatters = {
  "Metric Ton": n => `${n.toFixed()} 📦`,
  "Sheep": n => `🐑 ${n.toFixed()}`
};

const VizbuilderPanel = props =>
  <Vizbuilder
    allowedChartTypes={["barchart", "barchartyear", "lineplot", "stacked", "treemap", "geomap", "donut"]}
    cube={props.cube}
    downloadFormats={["svg", "png"]}
    formatters={formatters}
    params={props.params}
    result={props.result}
    showConfidenceInt={false}
  />;

const PANELS = [
  {key: "table", label: "Data Table", component: TableView},
  {key: "matrix", label: "Pivot Table", component: PivotView},
  {key: "debug", label: "Raw response", component: DebugView},
  {key: "vizbuilder", label: "Vizbuilder", component: VizbuilderPanel}
];

ReactDOM.render(
  <Explorer
    source="/olap/"
    formatters={formatters}
    dataLocale="en,es"
    previewLimit={75}
    panels={PANELS}
    withinMantineProvider
    withinReduxProvider
    withMultiQuery
    withPermalink
  />,
  document.getElementById("app")
);
