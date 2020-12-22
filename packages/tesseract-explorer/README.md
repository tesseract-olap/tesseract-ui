# tesseract-explorer

A friendly interface to explore the contents of a tesseract-olap server.

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

This package exports a React.Component and a reducer function to use in redux. To use them:

```js
import {explorerReducer} from "@datawheel/tesseract-explorer";

function rootReducer(state = initialState, action) {
  return {
    ...explorerReducer(state, action),
    yourKey: yourReducer(state, action)
  }
}
```

As you see, you'll need to integrate the Explorer's state directly to the root of the general state. We are working in a better solution. The explorer state keys are prefixed with `explorer` so they won't conflict with your keys.

```jsx
import {Explorer as TesseractExplorer} from "@datawheel/tesseract-explorer";

import "@datawheel/tesseract-explorer/dist/explorer.css";

function PageComponent(props) {
  return <TesseractExplorer src="https://tesseract.server.url/" />;
}
```

## Annotations

### Cube

|Annotation Name|Description|
|:---|:---|:--:|
|source_name|Organization that produces/published the data (ex. "Census Bureau" or "BACI").|
|source_link|Web address for the organization (will turn `source_name` display into an anchor link).|
|source_description|Description of the source organization (typically a few short sentences).||
|dataset_name|Title for the specific dataset/table (ex. "ACS 1-Year Estimate" or "HS6 REV. 1992 (1995 - 2018)").|
|dataset_link|Web address for the dataset (will turn `dataset_name` display into an anchor link).|
|dataset_description|Description of the dataset (typically a few short sentences).||

### Measures

|Annotation Name|Description|
|:---|:---|:--:|
|aggregation_method|The method by which a measure should be aggregated (if the root aggregation type is unknown).<br /><br />Valid values include: `COUNT`, `SUM`, `AVERAGE`, `MEDIAN`, `RCA`.|
|format_template|A template string that specifies how the numeric values of a measure should be displayed to users. Can be any valid [d3plus-format](https://github.com/d3plus/d3plus-format/#d3plusformatspecifier-) string specifier, which extends the base specifiers defined by [d3-format](https://github.com/d3/d3-format/#locale_format).<br /><br />Defaults to `".3~a"`, which abbreviates large numbers and adds the appropriate suffix (ie. `1234567890` becomes `1.23B`).|
|description|The text description of a measure, typically 1-3 short sentences.|

### Locale Support

For descriptive annotations, if you need texts for different languages, you can add `_<locale>` as a suffix. For example, `source_name` for English and Spanish should be `source_name_en` and `source_name_es`.

## License

© 2019 [Datawheel, LLC](https://datawheel.us/)  
This project is made available under the [MIT License](./LICENSE).
