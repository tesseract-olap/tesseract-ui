import {createSelector} from "reselect";
import {selectCurrentQueryItem} from "../queries/selectors";

/**
 * @returns {QueryResult}
 */
export const selectCurrentQueryResult = createSelector(
  selectCurrentQueryItem,
  query => query.result
);

export const selectChartConfigText = createSelector(
  selectCurrentQueryResult,
  result => result.chartConfig
);

export const selectChartType = createSelector(
  selectCurrentQueryResult,
  result => result.chartType
);
