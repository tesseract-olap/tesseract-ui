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

## License

© 2019 [Datawheel, LLC](https://datawheel.us/)
This project is made available under the [MIT License](./LICENSE).
