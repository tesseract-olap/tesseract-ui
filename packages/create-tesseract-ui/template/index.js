import {createElement} from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  createElement(App, {
    serverUrl: process.env.__SERVER_URL__,
    appTitle: process.env.__APP_TITLE__
  }),
  document.getElementById("app")
);
