import * as OlapClnt from "@datawheel/olap-client";
import {TranslationProviderProps} from "@datawheel/use-translation";
import {AxiosRequestConfig} from "axios";
import {default as React} from "react";
import {MapDispatchToProps, MapStateToProps} from "react-redux";
import {default as Redux} from "redux";

export = TessExpl;

declare namespace TessExpl {
  const Explorer: React.FC<ExplorerProps>;

  const DebugView: React.FC<ViewProps>;
  const PivotView: React.FC<ViewProps>;
  const TableView: React.FC<ViewProps>;

  const explorerInitialState: () => State.ExplorerState;
  const explorerReducer: Redux.Reducer<State.ExplorerState>;

  const olapMiddleware: Redux.Middleware<{}, State.ExplorerState>;
  const permalinkMiddleware: Redux.Middleware<{}, State.ExplorerState>;

  interface ExplorerProps {
    /**
     * A classname to add to the app wrapper node.
     */
    className?: string;

    /**
     * The URL for the data server.
     * Can be setup as a string, or a [AxiosRequestConfig](https://github.com/axios/axios#request-config)
     * for more complex handling of authorization/authentication.
     */
    src: string | AxiosRequestConfig;

    /**
     * Defines an index of formatter functions available to the measures shown
     * in the app, besides a limited list of default ones. The key used comes
     * from `measure.annotations.units_of_measurement`, if present.
     */
    formatters?: Record<string, Formatter>;

    /** A list of the available locale options */
    locale?: string[];

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
     * The default locale to use in the Explorer component UI.
     */
    uiLocale?: TranslationProviderProps["defaultLocale"];
  }

  interface ViewProps {
    className?: string;
    cube: OlapClnt.AdaptedCube;
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
      status: string;
      trigger: string | null;
    }

    interface QueriesState {
      current: string;
      itemMap: Record<string, Struct.QueryItem>;
    }

    interface ServerState {
      cubeMap: Record<string, OlapClnt.AdaptedCube>;
      endpoint: string;
      localeOptions: string[];
      online: boolean | undefined;
      software: string;
      url: string;
      version: string;
    }

    type MapStateFn<T, U> = MapStateToProps<T, U, ExplorerState>;
    type MapDispatchFn<T, U> = MapDispatchToProps<T, U>;
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
      booleans: Record<string, boolean>;
      cube: string;
      cuts: Record<string, CutItem>;
      drilldowns: Record<string, DrilldownItem>;
      filters: Record<string, FilterItem>;
      growth: Record<string, GrowthItem>;
      locale: string | undefined;
      measures: Record<string, MeasureItem>;
      pagiLimit: number | undefined;
      pagiOffset: number | undefined;
      rca: Record<string, RcaItem>;
      sortDir: "asc" | "desc";
      sortKey: string | undefined;
      topk: Record<string, TopkItem>;
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
    }

    interface FilterItem extends IQueryItem {
      measure: string;
      comparison: OlapClnt.Comparison;
      inputtedValue: string;
      interpretedValue: number;
    }

    interface GrowthItem extends IQueryItem {
      level: string;
      measure: string;
    }

    interface MeasureItem extends IQueryItem {
      aggType: string;
      measure: string;
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
    }

    interface RcaItem extends IQueryItem {
      level1: string;
      level2: string;
      measure: string;
    }

    interface TopkItem extends IQueryItem {
      amount: number;
      level: string;
      measure: string;
      order: "asc" | "desc";
    }

    type MemberRecords = Record<string, MemberItem>;

    type MeasurableItem = MeasureItem | FilterItem;

    interface SerializedQuery {
      booleans?: number;
      cube: string;
      cuts?: string[];
      drilldowns?: string[];
      filters?: string[];
      growth?: string[];
      locale?: string;
      measures?: string[];
      rca?: string[];
      topk?: string[];
    }

    interface LevelLike {
      dimension: string;
      hierarchy: string;
      name: string;
    }

    interface LevelRef {
      dimension: string;
      hierarchy: string;
      level: string;
    }

    type LevelDescriptor = LevelLike | LevelRef;
  }
}
