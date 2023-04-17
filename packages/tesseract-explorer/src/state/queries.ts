import {PayloadAction as Action, AnyAction, createSelector, createSlice} from "@reduxjs/toolkit";
import ISO6391 from "iso-639-1";
import {sortByDate} from "../utils/array";
import {getKeys, getValues, hasOwnProperty} from "../utils/object";
import {CutItem, DrilldownItem, FilterItem, MeasureItem, QueryItem, QueryParams, QueryResult, buildQuery, buildQueryParams} from "../utils/structs";
import {isValidQueryVerbose} from "../utils/validation";
import {selectServerState} from "./server";
import type {ExplorerState} from "./store";

export interface QueriesState {
  current: string;
  itemMap: Record<string, QueryItem>;
}

const name = "explorerQueries";

const initialState: QueriesState = {
  current: "default",
  itemMap: {
    default: buildQuery({key: "default"})
  }
};

export const queriesSlice = createSlice({
  name,
  initialState,
  reducers: {
    // =========================================================================
    // GENERAL QUERIES MANAGEMENT

    /**
     * By default, removes all queries from the application state.
     * If passed a payload, replaces the query map from the application state
     * with its contents, and selects a new current query in the UI.
     */
    resetQueries(state, {payload = {}}: Action<Record<string, any>>) {
      if (!hasOwnProperty(payload, state.current)) {
        state.current = Object.keys(payload)[0];
      }
      state.itemMap = payload;
    },

    /**
     * Removes a query from the application state.
     * If this query was currently selected, the selection changes to some other
     * query in the map.
     * This action does nothing if there's only a single query in the records.
     */
    removeQuery(state, action: Action<string>) {
      const amount = Object.keys(state.itemMap).length;
      if (amount < 2) return;

      delete state.itemMap[action.payload];
      if (!hasOwnProperty(state.itemMap, state.current)) {
        state.current = Object.keys(state.itemMap)[0];
      }
    },

    /**
     * Selects a new current query in the UI.
     */
    selectQuery(state, action: Action<string>) {
      state.current = action.payload;
    },

    /**
     * Updates the contents of a query.
     * The payload replaces the query in the state, instead of extending it.
     */
    updateQuery(state, {payload}: Action<QueryItem>) {
      state.itemMap[payload.key] = payload;
    },

    // =========================================================================
    // CURRENT QUERY MANAGEMENT

    /**
     * Remove a single CutItem from the current QueryItem.
     */
    removeCut(state, action: Action<string>) {
      const query = taintCurrentQuery(state);
      delete query.params.cuts[action.payload];
    },

    /**
     * Remove a single DrilldownItem from the current QueryItem.
     */
    removeDrilldown(state, action: Action<string>) {
      const query = taintCurrentQuery(state);
      delete query.params.drilldowns[action.payload];
    },

    /**
     * Remove a single FilterItem from the current QueryItem.
     */
    removeFilter(state, action: Action<string>) {
      const query = taintCurrentQuery(state);
      delete query.params.filters[action.payload];
    },

    /**
     * Replaces multiple QueryParams for the current QueryItem at once.
     */
    resetAllParams(state, action: Action<Partial<QueryParams>>) {
      const query = taintCurrentQuery(state);
      query.params = buildQueryParams(action.payload);
    },

    /**
     * Replaces the record of CutItem in the current QueryItem.
     */
    resetCuts(state, action: Action<QueryParams["cuts"]>) {
      const query = taintCurrentQuery(state);
      query.params.cuts = action.payload;
    },

    /**
     * Replaces the record of CutItem in the current QueryItem.
     */
    resetDrilldowns(state, action: Action<QueryParams["drilldowns"]>) {
      const query = taintCurrentQuery(state);
      query.params.drilldowns = action.payload;
    },

    /**
     * Replaces the record of FilterItem in the current QueryItem.
     */
    resetFilters(state, action: Action<QueryParams["filters"]>) {
      const query = taintCurrentQuery(state);
      query.params.filters = action.payload;
    },

    /**
     * Replaces the record of MeasureItem in the current QueryItem.
     */
    resetMeasures(state, action: Action<QueryParams["measures"]>) {
      const query = taintCurrentQuery(state);
      query.params.measures = action.payload;
    },

    /**
     * Sets the previewLimit value for the current QueryItem.
     */
    updatePreviewLimit(state, {payload}: Action<number | undefined>) {
      const query = taintCurrentQuery(state);
      query.params.previewLimit = payload || 0;
    },

    /**
     * Sets the value of a boolean in the current QueryItem.
     * If the action does not specify a new value, toggles the current value.
     */
    updateBoolean(state, {payload}: Action<{key: string, value?: boolean}>) {
      const query = taintCurrentQuery(state);
      query.params.booleans[payload.key] = typeof payload.value === "boolean"
        ? payload.value
        : !query.params.booleans[payload.key];
    },

    /**
     * Sets a new cube for the current QueryItem, and updates its available measures.
     */
    updateCube(state, {payload}: Action<{cube: string, measures: Record<string, MeasureItem>}>) {
      const query = taintCurrentQuery(state);
      if (payload.cube !== query.params.cube) {
        const {params, result} = buildQuery({params: {
          cube: payload.cube,
          measures: payload.measures,
          locale: query.params.locale
        }});
        query.isDirty = false;
        query.params = params;
        query.result = result;
      }
      if (payload.measures.length !== query.params.measures.length) {
        query.params.cube = payload.cube;
        query.params.measures = payload.measures;
      }
    },

    /**
     * Replaces a single CutItem in the current QueryItem.
     */
    updateCut(state, {payload}: Action<CutItem>) {
      const query = taintCurrentQuery(state);
      query.params.cuts[payload.key] = payload;
    },

    /**
     * Replaces a single DrilldownItem in the current QueryItem.
     */
    updateDrilldown(state, {payload}: Action<DrilldownItem>) {
      const query = taintCurrentQuery(state);
      query.params.drilldowns[payload.key] = payload;
    },

    /**
     * Replaces a single FilterItem in the current QueryItem.
     */
    updateFilter(state, {payload}: Action<FilterItem>) {
      const query = taintCurrentQuery(state);
      query.params.filters[payload.key] = payload;
    },

    /**
     * Replaces the locale setting in the current QueryItem.
     */
    updateLocale(state, {payload}: Action<string>) {
      const query = taintCurrentQuery(state);
      query.params.locale = payload;
    },

    /**
     * Replaces a single MeasureItem in the current QueryItem.
     */
    updateMeasure(state, {payload}: Action<MeasureItem>) {
      const query = taintCurrentQuery(state);
      query.params.measures[payload.key] = payload;
    },

    /**
     * Replaces the pagination settings in the current QueryItem.
     */
    updatePagination(state, {payload}: Action<{limit: number | "", offset: number | ""}>) {
      const query = taintCurrentQuery(state);
      query.params.pagiLimit = payload.limit;
      query.params.pagiOffset = payload.offset;
    },

    /**
     * Replaces the sorting settings in the current QueryItem.
     */
    updateSorting(state, {payload}: Action<{key: string, dir: "asc" | "desc"}>) {
      const query = taintCurrentQuery(state);
      query.params.sortDir = payload.dir;
      query.params.sortKey = payload.key;
    },

    /**
     * Registers the result of the current QueryItem in the store.
     */
    updateResult(state, {payload}: Action<QueryResult>) {
      const query = state.itemMap[state.current];
      query.isDirty = payload.status < 200 || payload.status > 299;
      query.result = payload;
    }
  }
});

export const queriesActions = {
  ...queriesSlice.actions
};

/**
 * Gets the currently selected QueryItem object, and marks it as dirty.
 * This function is only for use in reducers which will modify the state.
 */
function taintCurrentQuery<S extends QueriesState>(state: S) {
  const current = state.itemMap[state.current];
  current.isDirty = true;
  return current as S["itemMap"][string];
}

// SELECTORS

/**
 * Selector for the root QueriesState
 */
export function selectQueriesState(state: ExplorerState): QueriesState {
  return state[name];
}

export const selectQueryItems = createSelector(
  selectQueriesState,
  queries => sortByDate(Object.values(queries.itemMap), "created", false)
);

export const selectCurrentQueryItem = createSelector(
  selectQueriesState,
  queries => queries.itemMap[queries.current]
);

export const selectCurrentQueryParams = createSelector(
  selectCurrentQueryItem,
  query => query.params
);

export const selectCubeName = createSelector(
  selectCurrentQueryParams,
  params => params.cube
);

export const selectLocale = createSelector(
  [selectCurrentQueryParams, selectServerState],
  (params, server) => {
    const code = params.locale || server.localeOptions[0] || "";
    return {
      code,
      name: ISO6391.getName(code),
      nativeName: ISO6391.getNativeName(code)
    };
  }
);

export const selectCutMap = createSelector(
  selectCurrentQueryParams,
  params => params.cuts
);
export const selectCutKeys = createSelector(selectCutMap, getKeys);
export const selectCutItems = createSelector(selectCutMap, getValues<CutItem>);

export const selectDrilldownMap = createSelector(
  selectCurrentQueryParams,
  params => params.drilldowns
);
export const selectDrilldownKeys = createSelector(selectDrilldownMap, getKeys);
export const selectDrilldownItems = createSelector(selectDrilldownMap, getValues<DrilldownItem>);

export const selectFilterMap = createSelector(
  selectCurrentQueryParams,
  params => params.filters
);
export const selectFilterKeys = createSelector(selectFilterMap, getKeys);
export const selectFilterItems = createSelector(selectFilterMap, getValues<FilterItem>);

export const selectMeasureMap = createSelector(
  selectCurrentQueryParams,
  params => params.measures
);
export const selectMeasureKeys = createSelector(selectMeasureMap, getKeys);
export const selectMeasureItems = createSelector(selectMeasureMap, getValues<MeasureItem>);

export const selectBooleans = createSelector(
  selectCurrentQueryParams,
  params => params.booleans
);
export const selectIsPreviewMode = createSelector(
  selectCurrentQueryParams,
  params => params.previewLimit > 0
);

export const selectPaginationParams = createSelector(
  selectCurrentQueryParams,
  params => ({limit: params.pagiLimit || 0, offset: params.pagiOffset || 0})
);

export const selectSortingParams = createSelector(
  selectCurrentQueryParams,
  params => ({sortKey: params.sortKey || "", sortDir: params.sortDir})
);

export const selectValidQueryStatus = createSelector(
  selectCurrentQueryParams,
  params => isValidQueryVerbose(params)
);
