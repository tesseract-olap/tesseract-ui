export const SERVER_UPDATE = "explorer/SERVER/UPDATE";
export const ENDPOINT_UPDATE = "explorer/SERVER/UPDATE_ENDPOINT";


/** @type {TessExpl.State.ServerState} */
export const serverInitialState = {
  cubeMap: {},
  endpoint: "aggregate",
  localeOptions: ["en"],
  online: undefined,
  software: "",
  url: "",
  version: ""
};


/** @type {import("redux").Reducer<TessExpl.State.ServerState>} */
export function serverReducer(state = serverInitialState, action) {
  const effector = effectors[action.type];
  return typeof effector === "function" ? effector(state, action.payload) : state;
}


const effectors = {

  /**
   * @type {(state: TessExpl.State.ServerState, payload: any) => TessExpl.State.ServerState}
   */
  [SERVER_UPDATE]: (state, payload) => ({...state, ...payload}),

  /**
   * Updates the type of endpoint to use in the current query.
   *
   * @type {(state: TessExpl.State.ServerState, payload?: string) => TessExpl.State.ServerState}
   */
  [ENDPOINT_UPDATE]: (state, payload) => ({
    ...state,
    endpoint: payload || (state.endpoint === "aggregate" ? "logiclayer" : "aggregate")
  })
};
