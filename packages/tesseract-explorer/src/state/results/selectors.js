import {createSelector} from "reselect";
import {selectCurrentQueryItem} from "../queries/selectors";
import {selectOlapMeasureItems, selectOlapLevelMap} from "../selectors";

/**
 * @returns {QueryResult}
 */
export const selectCurrentQueryResults = createSelector(
  selectCurrentQueryItem,
  query => query.result
);

export const selectChartConfigText = createSelector(
  selectCurrentQueryResults,
  result => result.chartConfig
);

export const selectChartType = createSelector(
  selectCurrentQueryResults,
  result => result.chartType
);

export const selectPivotColumnLevel = createSelector(
  [selectCurrentQueryResults, selectOlapLevelMap],
  ({pivotColumns}, levelMap) => (pivotColumns ? levelMap[pivotColumns] : undefined)
);

export const selectPivotRowLevel = createSelector(
  [selectCurrentQueryResults, selectOlapLevelMap],
  ({pivotRows}, levelMap) => (pivotRows ? levelMap[pivotRows] : undefined)
);

export const selectPivotValueMeasure = createSelector(
  [selectCurrentQueryResults, selectOlapMeasureItems],
  ({pivotValues}, measures) => measures.find(measure => measure.name === pivotValues)
);
