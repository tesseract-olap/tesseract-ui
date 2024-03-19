import {DebugView, Explorer, PivotView, TableView} from "@datawheel/tesseract-explorer";
import {createVizbuilderView} from "@datawheel/tesseract-vizbuilder";
import Head from "next/head";
import React from "react";

import "normalize.css";

const headers = {};
if (process.env.OLAPPROXY_JWTAUTH) {
  headers["x-tesseract-jwt-token"] = process.env.OLAPPROXY_JWTAUTH;
}

const VizbuilderPanel = createVizbuilderView({
  chartTypes: ["barchart", "barchartyear", "lineplot", "stacked", "treemap", "geomap", "donut"],
  downloadFormats: ["svg", "png"],
  showConfidenceInt: false
});

const PANELS = [
  {key: "table", label: "Data Table", component: TableView},
  {key: "matrix", label: "Pivot Table", component: PivotView},
  {key: "vizbuilder", label: "Vizbuilder", component: VizbuilderPanel},
  {key: "debug", label: "Raw response", component: DebugView}
];

/** */
export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Explorer
        panels={PANELS}
        previewLimit={100}
        source={{
          headers,
          url: "/olap"
        }}
        withinMantineProvider
        withinReduxProvider
        withMultiQuery
        withPermalink
      />
    </div>
  );
}
