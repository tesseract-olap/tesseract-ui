import {createSelector} from "reselect";
import {selectCurrentQueryItem} from "../queries/selectors";
import {selectOlapLevelMap, selectOlapMeasureItems} from "../selectors";

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

export const selectPivotColumnLevel = createSelector(
  [selectCurrentQueryResult, selectOlapLevelMap],
  ({pivotColumns}, levelMap) => pivotColumns ? levelMap[pivotColumns] : undefined
);

export const selectPivotRowLevel = createSelector(
  [selectCurrentQueryResult, selectOlapLevelMap],
  ({pivotRows}, levelMap) => pivotRows ? levelMap[pivotRows] : undefined
);

export const selectPivotValueMeasure = createSelector(
  [selectCurrentQueryResult, selectOlapMeasureItems],
  ({pivotValues}, measures) => measures.find(measure => measure.name === pivotValues)
);
