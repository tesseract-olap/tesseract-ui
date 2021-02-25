# tesseract-explorer

A friendly interface to explore the contents of a tesseract-olap server.

## Installation

```bash
npm install @datawheel/tesseract-explorer
```

This project has some peer dependencies, which must be installed by the used manually:

```bash
npm install react@16 react-dom@16 react-redux@7 redux@4
npm install @blueprintjs/core@3 @blueprintjs/popover2@0 @blueprintjs/select@3 @blueprintjs/table@3
```

This is to prevent conflicts with hooks implemented in React 16.7, and to allow compatibility with the minor version of blueprintjs the user chooses.

## Usage

This package exports a `React.Component` and a reducer function to add to the redux store. To implement them:

```js
import {explorerReducer} from "@datawheel/tesseract-explorer";

function rootReducer(state = initialState, action) {
  return {
    yourKey: yourReducer(state, action),
    // you can either merge the Explorer state in your root app state
    ...explorerReducer(state, action),
    // or set it in with the "explorer" key
    explorer: explorerReducer(state, action)
  }
}
```

Then you can setup the `Explorer` component like this:

```jsx
import {Explorer as TesseractExplorer} from "@datawheel/tesseract-explorer";

// You must import blueprint's stylesheets too
import "normalize.css/normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "@blueprintjs/table/lib/css/table.css";

// Tesseract Explorer's stylesheets comes after
import "@datawheel/tesseract-explorer/dist/explorer.css";

function PageComponent(props) {
  return <TesseractExplorer src="https://tesseract.server.url/" />;
}
```

### Customize views

By default, the results obtained by a query can be presented in three views:
- `Data table`, a spreadsheet-like table that shows a fragment of the data
- `Pivot table`, a mini-app where you can export the data in a 2-dimensional matrix
- `Raw response`, a debugging view to get more info about the query and how to replicate it in code

These three views are also exported by this package:

```js
import {DebugView, TableView, PivotView} from "@datawheel/tesseract-explorer";
```

To remove a view or change their order, you can pass a `panels` property to the `Explorer` component:

```jsx
const PANELS = {
  "Results Table": TableView,
  "Pivot Data": PivotView
};

function PageComponent(props) {
  return <TesseractExplorer
    src="https://tesseract.server.url/"
    panels={PANELS}
  />;
}
```

The keys of the object will be used as the name of each tab, and the values are the raw react components. The components are then activated and passed the following properties:

```ts
interface ViewProps {
  cube: OlapClient.AdaptedCube;
  result: TessExpl.Struct.QueryResult;
  params: TessExpl.Struct.QueryParams;
}
```

This also means the `Explorer` component can be extended with external views that make use of the same interface.

### Data locale

If the data server is configured to output data in multiple locales, you can let the user pick the language by passing the `locale` property:

```jsx
function PageComponent(props) {
  return <TesseractExplorer
    src="https://tesseract.server.url/"
    locale={["en", "es"]}
  />;
}
```

These will be presented in the UI as a selector with the name of the language, and the parameter will be added to the queries.

## License

©2018-2021 [Datawheel, LLC](https://datawheel.us/)  
This project is made available under the [MIT License](./LICENSE).
