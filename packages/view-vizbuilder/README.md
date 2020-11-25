# tesseract-vizbuilder

Generates a Vizbuilder view for results query in Tesseract Explorer.

## Installation

On a webapp with `@datawheel/tesseract-explorer` already installed, run:

```bash
npm install @datawheel/tesseract-vizbuilder
```

You can't use the default exported component of the package directly, because it requires some additional properties to be passed that are not part of the Tesseract Explorer view plugin specification, and define how the Vizbuilder component behaves.

To prepare the Vizbuilder component, create a new intermediate component:

```jsx
import Vizbuilder from "@datawheel/tesseract-vizbuilder";
import React from "react";

const TOPOJSON = {
  "State": {
    topojson: "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json",
    projection: "geoAlbersUsaTerritories",
    tiles: false,
  }
};

const FORMATTERS = {
  Dollars: value => `USD $${value}`
};

const VizbuilderView = props => (
  <Vizbuilder
    // The following three parameters are given by Tesseract Explorer, so bypass them
    cube={props.cube}
    result={props.result}
    params={props.params}
    // Add the needed additional parameters to make the @datawheel/vizbuilder component work
    allowedChartTypes={["barchart", "barchartyear", "geomap", "lineplot", "stacked", "treemap"]}
    formatters={FORMATTERS}
    getTopojson={TOPOJSON}
    showConfidenceInt={false}
  />
);

export default VizbuilderView;
```

Then add this new component to the `panels` object passed to the Explorer:

```jsx
import {Explorer, DebugView, TableView, PivotView} from "@datawheel/tesseract-explorer";
import VizbuilderView from "./VizbuilderView";

const PANELS = {
  "Vizbuilder": VizbuilderView,
  "Table": TableView,
  "Pivot": PivotView,
  "Debug": DebugView
};

...

  return (
    <Explorer
      src="https://tesseract.olap/server/"
      panels={PANELS}
      title="Data Explorer"
    />
  );
```

You can control completely how these parameters are obtained; you can set them through [React Context](https://reactjs.org/docs/context.html) or other mean.  
You can also use [`React.lazy`](https://reactjs.org/docs/code-splitting.html#reactlazy) (`React.Suspense` is already set inside the Explorer component) to lazily load this new view, and also split the dependencies added by the Vizbuilder component.

## License

© 2020 [Datawheel, LLC](https://datawheel.us/)  
This project is made available under the [MIT License](./LICENSE).
