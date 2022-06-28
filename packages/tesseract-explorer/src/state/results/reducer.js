export const RESULT_QUERY_UPDATE = "explorer/RESULT/QUERY/UPDATE";
export const RESULT_JOIN_UPDATE = "explorer/RESULT/JOIN/UPDATE";


/** @type {Record<string, (results: TessExpl.Struct.QueryResult, payload: any) => TessExpl.Struct.QueryResult>} */
export const resultsEffectors = {

  /**
   * @param {TessExpl.Struct.QueryResult} results
   * @param {Partial<TessExpl.Struct.QueryResult>} payload
   */
  [RESULT_QUERY_UPDATE]: (results, payload) => ({
    ...results,
    ...payload,
    data: payload.error ? [] : payload.data ?? results.data
  }),

  /**
   * @param {TessExpl.Struct.JoinResult} results
   * @param {Partial<TessExpl.Struct.JoinResult>} payload
   */
  [RESULT_JOIN_UPDATE]: (results, payload) => ({
    ...results,
    ...payload,
    data: payload.error ? [] : payload.data ?? results.data
  })
};
