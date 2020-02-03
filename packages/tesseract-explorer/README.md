# tesseract-explorer

A friendly interface to explore the contents of a tesseract-olap server.

## Installation

```bash
npm install @datawheel/tesseract-explorer
```

This project has some peer dependencies, which must be installed by the user manually:

```bash
npm install react@16 react-dom@16 react-redux@7 redux@4
npm install @blueprintjs/core@3 @blueprintjs/select@3 @blueprintjs/table@3
```

This is to prevent conflicts with hooks implemented in React 16.7, and to allow compatibility with the minor version of blueprintjs the user chooses.

## Usage

This package exports a React.Component, two middlewares, a reducer function to use in redux, and a initial state factory function.  

### Redux

The redux state can be integrated in two ways: directly into the root state of your app, or namespaced in the `explorer` key.

```js
import {explorerReducer} from "@datawheel/tesseract-explorer";

function rootReducer(state = initialState, action) {
  return {
    yourKey: yourReducer(state, action),
    yourOtherKey: yourOtherReducer(state, action),
    // Pick one:
    // A: integrated in the root state:
    ...explorerReducer(state, action),
    // B: namespaced in the explorer key:
    explorer: explorerReducer(state, action)
  }
}
```

Since `explorerReducer` is just a reducer function, if you pick option A and there's nothing else in your redux state, you can use the `explorerReducer` function in place of the `rootReducer` function from this example.  
In any case, the explorer state keys are prefixed with `explorer` so they won't conflict with your keys.

### Middlewares

This package exports two middlewares: `olapMiddleware` and `permalinkMiddleware`.

```js
import {explorerInitialState, olapMiddleware, permalinkMiddleware} from "@datawheel/tesseract-explorer";
import {applyMiddleware, compose, createStore} from "redux";

const initialState = explorerInitialState();
const enhancers = compose(applyMiddleware(permalinkMiddleware, olapMiddleware));

const store = createStore(explorerReducer, initialState, enhancers);
```

The Explorer component needs at least the `olapMiddleware` to work correctly. The `permalinkMiddleware` only handles the update of the permalink in the browser's location bar.

### React

The react component is exported under the `Explorer` key. You can use it directly on any place you need:

```jsx
import {Explorer as TesseractExplorer} from "@datawheel/tesseract-explorer";

import "@datawheel/tesseract-explorer/dist/explorer.css";

function PageComponent(props) {
  return <TesseractExplorer src="https://tesseract.server.url/" />;
}
```

#### Properties

The Explorer component has the following properties:

> `src: string | string[]`

The URL of the OLAP server you want to interact with.  
You can pass an array of URLs and interact with multiple servers at once.

> `locale: string[]`

A list of the available locales for the data in your servers.  
Through `olap-client`, `tesseract-explorer` will try to handle the language of the labels in the data you receive.

> `title?: string`

Optionally, you can change the title label in the top-left corner of the interface.

## License

MIT © 2019 [Datawheel](https://datawheel.us/)
