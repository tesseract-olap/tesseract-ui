export const RESULT_UPDATE = "explorer/RESULT/DATA/UPDATE";

/**
 * @param {Partial<QueryResult>} payload
 */
export const doCurrentResultUpdate = payload => ({type: RESULT_UPDATE, payload});

/**
 * @param {string} chartType
 */
export const doChartTypeUpdate = chartType => doCurrentResultUpdate({chartType});

/**
 * @param {string} chartConfig
 */
export const doChartCodeUpdate = chartConfig => doCurrentResultUpdate({chartConfig});

/**
 * @param {string} pivotColumns
 */
export const doUpdateMatrixColumns = pivotColumns =>
  doCurrentResultUpdate({pivotColumns});

/**
 * @param {string} pivotRows
 */
export const doUpdateMatrixRows = pivotRows => doCurrentResultUpdate({pivotRows});

/**
 * @param {string} pivotValues
 */
export const doUpdateMatrixValues = pivotValues => doCurrentResultUpdate({pivotValues});
