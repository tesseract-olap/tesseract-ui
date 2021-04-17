import Vizbuilder from "@datawheel/tesseract-vizbuilder";
import React from "react";

import "@datawheel/tesseract-vizbuilder/dist/view-vizbuilder.css";

const FORMATTERS = {
};

const TOPOJSON = {
};

/** @type {React.FC<import("@datawheel/tesseract-vizbuilder").VizbuilderViewProps>} */
export const VizbuilderView = props => (
  <Vizbuilder
    cube={props.cube}
    result={props.result}
    params={props.params}
    formatters={FORMATTERS}
    allowedChartTypes={["barchart", "barchartyear", "geomap", "lineplot", "stacked", "treemap"]}
    className="vizbuilder-view"
    getTopojson={TOPOJSON}
    showConfidenceInt={false}
  />
);
