import * as OlapClnt from "@datawheel/olap-client";
import { TranslationProviderProps } from "@datawheel/use-translation";
import * as React from "react";
import * as Redux from "redux";

export = TessExpl;

declare namespace TessExpl {
  const Explorer: React.FC<ExplorerProps>;

  const DebugView: React.FC<ViewProps>;
  const PivotView: React.FC<ViewProps>;
  const TableView: React.FC<ViewProps>;

  const explorerReducer: Redux.Reducer<State.ExplorerState>;

  const olapMiddleware: Redux.Middleware<{}, State.ExplorerState>;
  const permalinkMiddleware: Redux.Middleware<{}, State.ExplorerState>;

  interface ExplorerProps {
    /**
     * A reference to the server with the data.
     * Can be setup as a string with the URL of the server, or a
     * [AxiosRequestConfig](https://github.com/axios/axios#request-config)
     * for more complex handling of authorization/authentication.
     */
    src: OlapClnt.ServerConfig;

    /**
     * A classname to add to the app wrapper node.
     */
    className?: string;

    /**
     * A component that is rendered to display the default "splash screen," the screen
     * that is shown in the results panel when there is no query or a query has been dirtied.
     */
    DefaultSplash?: React.FunctionComponent | React.ComponentClass;

    /**
     * Enables multiple query mode.
     * This adds a column where the user can quickly switch between queries,
     * like tabs in a browser.
     */
    multiquery?: boolean;

    /**
     * Defines an index of formatter functions available to the measures shown
     * in the app, besides a limited list of default ones. The key used comes
     * from `measure.annotations.units_of_measurement`, if present.
     */
    formatters?: Record<string, Formatter>;

    /**
     * A list of the available locale options.
     * A string will be splitted by commas (`,`) to try to interpret a list.
     */
    locale?: string | string[];

    /**
     * The list of tabs to offer to the user to render the results.
     * Must be an object whose keys are the label of the tab to show in the UI,
     * and whose values are non-hydrated React Components.
     */
    panels?: Record<string, React.FunctionComponent<ViewProps> | React.ComponentClass<ViewProps>>;

    /**
     * The Translation labels to use in the UI.
     */
    translations?: TranslationProviderProps["translations"];

    /**
     * Defines an element to show when the app is in an indeterminate state.
     */
    transientIcon?: React.ReactElement | React.ReactFragment | false;

    /**
     * The default locale to use in the Explorer component UI.
     */
    uiLocale?: TranslationProviderProps["defaultLocale"];

    /**
     * The default limit for preview queries.
     * Default 100
     */
    previewLimit?: number | 50;
  }

  interface ViewProps {
    className?: string;
    cube: OlapClnt.PlainCube;
    params: Struct.QueryParams;
    result: Struct.QueryResult;
  }

  type Formatter = (d: number) => string;

  namespace State {
    interface ExplorerState {
      explorerLoading: LoadingState;
      explorerQueries: QueriesState;
      explorerServer: ServerState;
    }

    interface LoadingState {
      error: string | null;
      loading: boolean;
      message?: {
        [params: string]: string;
        type: string;
      };
      status: string;
      trigger: string | null;
    }

    interface QueriesState {
      current: string;
      itemMap: Record<string, Struct.QueryItem>;
    }

    interface ServerState {
      cubeMap: Record<string, OlapClnt.PlainCube>;
      endpoint: string;
      localeOptions: string[];
      online: boolean | undefined;
      software: string;
      url: string;
      version: string;
    }
  }

  namespace Struct {
    interface QueryItem {
      created: string;
      isDirty: boolean;
      key: string;
      label: string;
      params: QueryParams;
      result: QueryResult;
    }

    interface QueryParams {
      booleans: Record<string, undefined | boolean>;
      cube: string;
      cuts: Record<string, CutItem>;
      drilldowns: Record<string, DrilldownItem>;
      filters: Record<string, FilterItem>;
      locale: string | undefined;
      measures: string[];
      pagiLimit: number | undefined;
      pagiOffset: number | undefined;
      sortDir: "asc" | "desc";
      sortKey: string | undefined;
    }

    interface QueryResult {
      data: Record<string, string | number>[];
      error: string | null;
      headers: Record<string, string>;
      sourceCall: string | undefined;
      status: number;
      urlAggregate: string | undefined;
      urlLogicLayer: string | undefined;
    }

    interface IQueryItem {
      active: boolean;
      readonly key: string;
    }

    interface CutItem extends IQueryItem {
      dimension: string;
      fullName: string;
      hierarchy: string;
      level: string;
      members: string[];
      uniqueName: string;
    }

    interface DrilldownItem extends IQueryItem {
      captionProperty: string;
      dimension: string;
      dimType: string;
      fullName: string;
      hierarchy: string;
      level: string;
      properties: PropertyItem[];
      uniqueName: string;
      memberCount: number;
    }

    interface FilterItem extends IQueryItem {
      measure: string;
      comparison: OlapClnt.Comparison;
      inputtedValue: string;
      interpretedValue: number;
    }

    interface MemberItem extends IQueryItem {
      name: string;
    }

    interface NamedSetItem extends IQueryItem {
      namedset?: string;
    }

    interface PropertyItem extends IQueryItem {
      level: string;
      name: string;
      uniqueName: string;
    }

    type MemberRecords = Record<string, MemberItem>;

    type MeasurableItem = FilterItem;

    interface SerializedQuery {
      query?: string;
      booleans?: number;
      cube: string;
      cuts?: string[];
      drilldowns?: string[];
      filters?: string[];
      locale?: string;
      measures?: string[];
    }

    interface LevelLike {
      dimension: string;
      hierarchy: string;
      name: string;
    }

    interface LevelDescriptor {
      dimension: string;
      hierarchy: string;
      level: string;
    }

    type LevelReference = LevelLike | LevelDescriptor;

    interface FileDescriptor {
      content: Blob | string;
      extension: string;
      name: string;
    }
  }
}

declare module "redux" {
  interface Dispatch<A extends Action<string>> {
    (action: Action<"explorer/CLIENT/DOWNLOADQUERY">): Promise<TessExpl.Struct.FileDescriptor>;
    (action: Action<"explorer/CLIENT/EXECUTEQUERY">): Promise<void>;
    (action: Action<"explorer/CLIENT/FETCHMEMBERS">): Promise<OlapClient.PlainMember[]>;
    (action: Action<"explorer/CLIENT/FILLPARAMS">): Promise<void>;
    (action: Action<"explorer/CLIENT/PARSEQUERYURL">): Promise<void>;
    (action: Action<"explorer/CLIENT/RELOADCUBES">): Promise<Record<string, OlapClient.PlainCube>>;
    (action: Action<"explorer/CLIENT/SELECTCUBE">): Promise<void>;
    (action: Action<"explorer/CLIENT/SETUPSERVER">): Promise<void>;
    (action: Action<"explorer/PERMALINK/UPDATE">): Promise<void> | undefined;
  }
}
