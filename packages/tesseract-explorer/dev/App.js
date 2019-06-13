import React from "react";
import {createStore} from "redux";
import {Provider} from "react-redux";
import {Explorer, explorerReducer} from "../dist/index.esm";

import "normalize.css/normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "@blueprintjs/table/lib/css/table.css";
import "../dist/index.esm.css";

const reduxDevTools =
  typeof window !== undefined &&
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__();
const store = createStore(explorerReducer, reduxDevTools);

function App() {
  return (
    <Provider store={store}>
      <Explorer src="https://api.oec.world/tesseract/" />
    </Provider>
  );
}

export default App;
