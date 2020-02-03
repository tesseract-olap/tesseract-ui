import {RESULT_UPDATE} from "./actions";

/** @type {Record<string, (results: QueryResult, payload: any) => QueryResult>} */
const effects = {

  /**
   * @param {QueryResult} results
   * @param {Partial<QueryResult>} payload
   */
  [RESULT_UPDATE]: (results, payload) => ({
    ...results,
    ...payload,
    data: payload.error ? [] : payload.data ?? results.data
  })
};

export default effects;
