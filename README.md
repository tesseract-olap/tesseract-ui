# @datawheel/tesseract-ui

A data exploration UI framework, to work with [`olap-client`](https://www.npmjs.com/package/@datawheel/olap-client)-compatible data servers.

## Packages

### [create-tesseract-ui](./packages/create-tesseract-ui/)

<a href="https://www.npmjs.com/package/@datawheel/create-tesseract-ui">
  <img src="https://img.shields.io/npm/v/@datawheel/create-tesseract-ui.svg" alt="npm package" align="right">
</a>

A `npm init` script to easily create a single working instance of tesseract-ui in a server.

### [DataExplorer](./packages/tesseract-explorer/)

<a href="https://www.npmjs.com/package/@datawheel/tesseract-explorer">
  <img src="https://img.shields.io/npm/v/@datawheel/tesseract-explorer.svg" alt="npm package" align="right">
</a>

The core of the project. This React component renders the whole main UI, but can be imported into any React framework.

### [Vizbuilder plugin](./packages/view-vizbuilder/)

<a href="https://www.npmjs.com/package/@datawheel/tesseract-vizbuilder">
  <img src="https://img.shields.io/npm/v/@datawheel/tesseract-vizbuilder.svg" alt="npm package" align="right">
</a>

A view plugin for DataExplorer. Integrates the [`@datawheel/vizbuilder`](https://www.npmjs.com/package/@datawheel/vizbuilder) React component to use the query result to generate charts.

## License

© 2019 [Datawheel, LLC](https://datawheel.us/)  
This project is made available under the [MIT License](./LICENSE).
