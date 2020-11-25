export const RESULT_UPDATE = "explorer/RESULT/DATA/UPDATE";

/**
 * @param {Partial<TessExpl.Struct.QueryResult>} payload
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
