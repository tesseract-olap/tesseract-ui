import {Client as OLAPClient} from "@datawheel/olap-client";
import {paramsEffectors, QUERY_LOCALE_UPDATE} from "../state/params/reducer";
import {selectIsFullResults} from "../state/params/selectors";
import {willRequestQuery} from "./olapActions";
import {olapEffectors} from "./olapEffectors";


export {permalinkMiddleware} from "./permalink";


/** @type {import("redux").Middleware<{}, TessExpl.State.ExplorerState>} */
export function olapMiddleware({dispatch, getState}) {
  const client = new OLAPClient();

  return next => action => {
    const effector = olapEffectors[action.type];
    const result = typeof effector === "function"
      ? effector({client, dispatch, getState, next}, action)
      : next(action);

    if (action.type in paramsEffectors) {
      const isFullResults = selectIsFullResults(getState());
      const isLocaleChange = action.type === QUERY_LOCALE_UPDATE;
      if (!isFullResults || isLocaleChange) {
        dispatch(willRequestQuery());
      }
    }

    return result;
  };
}
