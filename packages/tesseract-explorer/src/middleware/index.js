import {Client as OLAPClient} from "@datawheel/olap-client";
import {olapEffectors} from "./olapEffectors";


export {permalinkMiddleware} from "./permalink";


/** @type {import("redux").Middleware<{}, TessExpl.State.ExplorerState>} */
export function olapMiddleware({dispatch, getState}) {
  const client = new OLAPClient();

  return next => action => {
    const effector = olapEffectors[action.type];
    return typeof effector === "function"
      ? effector({client, dispatch, getState, next}, action)
      : next(action);
  };
}
