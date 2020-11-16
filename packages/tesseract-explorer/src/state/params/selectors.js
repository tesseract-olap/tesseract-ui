import {createSelector} from "reselect";
import {getKeys, getValues} from "../helpers";
import {selectCurrentQueryItem} from "../queries/selectors";

export const selectCurrentQueryParams = createSelector(
  selectCurrentQueryItem,
  query => query.params
);

export const selectCubeName = createSelector(
  selectCurrentQueryParams,
  params => params.cube
);

export const selectLocaleCode = createSelector(
  selectCurrentQueryParams,
  params => params.locale
);

export const selectCutMap = createSelector(
  selectCurrentQueryParams,
  params => params.cuts
);
export const selectCutKeys = createSelector(selectCutMap, getKeys);
export const selectCutItems = createSelector(selectCutMap, getValues);

export const selectDrilldownMap = createSelector(
  selectCurrentQueryParams,
  params => params.drilldowns
);
export const selectDrilldownKeys = createSelector(selectDrilldownMap, getKeys);
export const selectDrilldownItems = createSelector(selectDrilldownMap, getValues);

export const selectFilterMap = createSelector(
  selectCurrentQueryParams,
  params => params.filters
);
export const selectFilterKeys = createSelector(selectFilterMap, getKeys);
export const selectFilterItems = createSelector(selectFilterMap, getValues);

export const selectMeasureMap = createSelector(
  selectCurrentQueryParams,
  params => params.measures
);
export const selectMeasureKeys = createSelector(selectMeasureMap, getKeys);
export const selectMeasureItems = createSelector(selectMeasureMap, getValues);

export const selectGrowthMap = createSelector(
  selectCurrentQueryParams,
  params => params.growth
);
export const selectGrowthKeys = createSelector(selectGrowthMap, getKeys);
export const selectGrowthItems = createSelector(selectGrowthMap, getValues);

export const selectRcaMap = createSelector(selectCurrentQueryParams, query => query.rca);
export const selectRcaKeys = createSelector(selectRcaMap, getKeys);
export const selectRcaItems = createSelector(selectRcaMap, getValues);

export const selectTopkMap = createSelector(
  selectCurrentQueryParams,
  query => query.topk
);
export const selectTopkKeys = createSelector(selectTopkMap, getKeys);
export const selectTopkItems = createSelector(selectTopkMap, getValues);

export const selectBooleans = createSelector(
  selectCurrentQueryParams,
  params => params.booleans
);

export const selectPaginationParams = createSelector(
  selectCurrentQueryParams,
  params => ({limit: params.pagiLimit, offset: params.pagiOffset})
);

export const selectSortingParams = createSelector(
  selectCurrentQueryParams,
  params => ({sortKey: params.sortKey, sortDir: params.sortDir})
);
