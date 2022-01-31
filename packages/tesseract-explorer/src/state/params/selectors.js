import ISO6391 from "iso-639-1";
import {createSelector} from "reselect";
import {isValidQueryVerbose} from "../../utils/validation";
import {getKeys, getValues} from "../helpers";
import {selectCurrentQueryItem} from "../queries/selectors";
import {selectServerState} from "../server/selectors";

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
