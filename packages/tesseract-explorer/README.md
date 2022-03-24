# tesseract-explorer

A friendly interface to explore the contents of a tesseract-olap server.

[![npm package](https://img.shields.io/npm/v/@datawheel/tesseract-explorer.svg)](https://www.npmjs.com/package/@datawheel/tesseract-explorer)

## Installation

```bash
npm install @datawheel/tesseract-explorer
```

This project has some peer dependencies, which must be installed by the used manually:

```bash
npm install react@16 react-dom@16 react-redux@7 redux@4
npm install @blueprintjs/core@3 @blueprintjs/select@3 @blueprintjs/table@3
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
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "@blueprintjs/table/lib/css/table.css";

// Tesseract Explorer's stylesheets must come after
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
  cube: OlapClient.PlainCube;
  result: TessExpl.Struct.QueryResult;
  params: TessExpl.Struct.QueryParams;
}
```

This also means the `Explorer` component can be extended with external views that make use of the same interface. You can check how these are composed on [the typing definitions file](./index.d.ts).

### Data locale

If the data server is configured to output data in multiple locales, you can let the user pick the language by passing the `locale` property:

```jsx
function PageComponent(props) {
  return <TesseractExplorer
    src="https://tesseract.server.url/"
    locale={["en", "es"]}
    // The property also accepts a comma-separated string
    locale={"es,en"}
  />;
}
```

The first item in the list will be used by default when the app loads.
The options will be presented in the UI as a selector with the name of the language, and the parameter will be added to the queries.

### UI Localization

By default the user interface will be in English, but you can localize it using the these properties:

```jsx
function PageComponent(props) {
  return <TesseractExplorer
    src="https://tesseract.server.url/"
    translations={translations}
    uiLocale="es"
  />;
}
```

* `translations` must be an object where the keys are the locale codes you intend to make available in the app, and the values are dictionaries that complies with the labels [defined in this file](./src/utils/localization.js).  
  This object is also exported by this package so you can check it yourself.
* `uiLocale`, which is not related to the `locale` property mentioned in the earlier section, must be a string matching one of the keys defined in the `translations` property.

When used, both properties are required.  
The locale keys used not necesarily must be ISO 639 codes; any string can do, but must match on both properties.

Some translation labels do interpolation of values when used. These are optional, but encouraged, and some can have additional values available:

* `params.current_endpoint` replaces `{label}` with the current kind of endpoint (`"aggregate"` or `"logiclayer"`) if the server is Tesseract OLAP
* `params.label_cube` has the `{name}` and `{caption}` properties of the cube (though `caption` comes from `annotations.caption`)
* `params.label_locale` has `{code}`, `{name}`, and `{nativeName}`, which would match to `"es"`, `"Spanish"`, and `"Español"`, respectively (and these values come from the options passed to `locale`)
* `params.label_topic` and `label_subtopic` replace `{label}` with its respective values from the cube annotations
* Wherever a number is used, the `{n}` tag contains the value, and you can define a label for the singular and plural forms: `key` for the singular, and `key_plural` for the plural.

### Additional formatters

The `formatters` property allows the user to set an index of formatter functions, which transform how the measures are shown in the UI.
To setup custom formatters, pass an object where the key is the name of the formatter, and its value is the function used to format, which must comply with the `Formatter` type: `(value: number) => string`

```jsx
// A good performance optimization is to memoize the object being passed
const formatterIndex = useMemo(() => ({
  Sheep: n => `🐑 ${n.toFixed()}`
}), []);

<TesseractExplorer
  {...}
  formatters={formatterIndex}
/>;
```

The app comes with a limited list of default ones: `Decimal` (1234.567), `Milliards` (1,234.567), `Dollars` ($1,234.57), and `Human` (1.23k).
The key used to select a formatter comes from the `format_template` annotation, and if not present, the `units_of_measurement` annotation in the measure data.  
* If the measure contains the `format_template` annotation, it is used to create a custom formatter on runtime. [Check the documentation](https://github.com/d3plus/d3plus-format#readme) for details on how to build and customize a template.
* If the `units_of_measurement` set is an official ISO 4217 currency code (three letters in caps), it will be parsed into a currency formatter using the browser's [`Intl.NumberFormat`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) constructor. Otherwise, the key is looked in the `formatters` property object and in the default formatters list.  
* If any of these are present, numbers are presented in Decimal format.

## License

©2018-2021 [Datawheel, LLC](https://datawheel.us/)  
This project is made available under the [MIT License](./LICENSE).
