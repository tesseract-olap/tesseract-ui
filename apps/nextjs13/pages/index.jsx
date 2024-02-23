import {DebugView, Explorer, PivotView, TableView} from "@datawheel/tesseract-explorer";
import Head from "next/head";
import React from "react";

const PANELS = [
  {key: "table", label: "Data Table", component: TableView},
  {key: "matrix", label: "Pivot Table", component: PivotView},
  {key: "debug", label: "Raw response", component: DebugView}
  // {key: "vizbuilder", label: "Vizbuilder", component: VizbuilderPanel}
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
        source={process.env.OLAPPROXY_TARGET}
        withinMantineProvider
        withinReduxProvider
        withMultiQuery
        withPermalink
      />
    </div>
  );
}
