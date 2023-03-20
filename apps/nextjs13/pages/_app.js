//@ts-check
import {
  explorerReducer,
  olapMiddleware,
  permalinkMiddleware
} from "@datawheel/tesseract-explorer";
import { MantineProvider } from "@mantine/core";
import React from "react";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";

const enhancers = compose(
  applyMiddleware(permalinkMiddleware, olapMiddleware)
);

const store = createStore(explorerReducer, undefined, enhancers);

export default function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </MantineProvider>
  );
}
