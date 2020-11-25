import {ENDPOINT_UPDATE, SERVER_UPDATE} from "./actions";

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
  const effector = effects[action.type];
  return effector ? effector(state, action.payload) : state;
}

/** @type {Record<string, (state: TessExpl.State.ServerState, payload: any) => TessExpl.State.ServerState>} */
const effects = {
  [SERVER_UPDATE]: (state, payload) => ({...state, ...payload}),

  [ENDPOINT_UPDATE]: (state, payload) => ({
    ...state,
    endpoint: payload || (state.endpoint === "aggregate" ? "logiclayer" : "aggregate")
  })
};
