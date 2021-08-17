// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

window.addEventListener("load", () => {
  document.title = "Director for Tesseract OLAP";

  const {FocusStyleManager} = require("@blueprintjs/core");
  const {createElement} = require("react");
  const ReactDOM = require("react-dom");
  const {Provider} = require("react-redux");
  const {applyMiddleware, compose, createStore} = require("redux");
  const {
    DebugView,
    Explorer,
    explorerReducer,
    olapMiddleware,
    PivotView,
    TableView
  } = require("@datawheel/tesseract-explorer");

  const enhancers = compose(
    applyMiddleware(olapMiddleware)
  );
  const store = createStore(explorerReducer, undefined, enhancers);

  FocusStyleManager.onlyShowFocusOnTabs();

  const PANELS = {
    "Data Table": TableView,
    "Pivot Table": PivotView,
    "Raw response": DebugView
  };

  ReactDOM.render(
    createElement(Provider, {store},
      createElement(Explorer, {
        multiquery: true,
        src: "https://api.datamexico.org/tesseract/",
        formatters: {Sheep: n => `🐑 ${n.toFixed()}`},
        panels: PANELS
      })
    ),
    document.getElementById("app")
  );
});
