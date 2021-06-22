export const RESULT_UPDATE = "explorer/RESULT/DATA/UPDATE";


/** @type {Record<string, (results: TessExpl.Struct.QueryResult, payload: any) => TessExpl.Struct.QueryResult>} */
export const resultsEffectors = {

  /**
   * @param {TessExpl.Struct.QueryResult} results
   * @param {Partial<TessExpl.Struct.QueryResult>} payload
   */
  [RESULT_UPDATE]: (results, payload) => ({
    ...results,
    ...payload,
    data: payload.error ? [] : payload.data ?? results.data
  })
};
