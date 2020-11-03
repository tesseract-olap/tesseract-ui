import {AxiosRequestConfig} from "axios";
import {default as React} from "react";
import {Middleware, Reducer} from "redux";

export const Explorer: React.FunctionComponent<IPropsExplorer>;

export const DebugView: React.FunctionComponent<IPropsView>;
export const PivotView: React.FunctionComponent<IPropsView>;
export const TableView: React.FunctionComponent<IPropsView>;

export const explorerInitialState: () => ExplorerState;
export const explorerReducer: Reducer<ExplorerState>;

export const olapMiddleware: Middleware<{}, ExplorerState>;
export const permalinkMiddleware: Middleware<{}, ExplorerState>;

interface IPropsExplorer {
  /**
   * The URL for the data server.
   * Can be setup as a string, or a [AxiosRequestConfig](https://github.com/axios/axios#request-config)
   * for more complex handling of authorization/authentication.
   */
  src: string | AxiosRequestConfig;

  /** A title to show on the navbar. */
  title?: React.ReactNode;

  /** A list of the available locale options */
  locale: string[];

  /**
   * The list of tabs to offer to the user to render the results.
   * Must be an object whose keys are the label of the tab to show in the UI,
   * and whose values are non-hydrated React Components.
   */
  panels: Record<string, React.FunctionComponent | React.ComponentClass>;
}

interface IPropsView {
  result: QueryResult;
  params: QueryParams;
}

export interface ExplorerState {
  explorerLoading: LoadingState;
  explorerQueries: QueriesState;
  explorerServer: ServerState;
  explorerUi: UiState;
}
