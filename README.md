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

### [ChartBuilder plugin](./packages/view-chartbuilder/)

<a href="https://www.npmjs.com/package/@datawheel/tesseract-chartbuilder">
  <img src="https://img.shields.io/npm/v/@datawheel/tesseract-chartbuilder.svg" alt="npm package" align="right">
</a>

A view plugin for DataExplorer. Allows to use the result query to build a d3plus chart config object, with previews.

## License

© 2019 [Datawheel, LLC](https://datawheel.us/)  
This project is made available under the [MIT License](./LICENSE).
