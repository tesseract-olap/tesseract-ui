import {Client as OLAPClient} from "@datawheel/olap-client";
import {doSetLoadingState} from "../state/loading/actions";
import {paramsEffectors} from "../state/params/reducer";
import {selectIsFullResults} from "../state/params/selectors";
import {willExecuteQuery} from "./olapActions";
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
      if (!isFullResults) {
        dispatch(doSetLoadingState("REQUEST"));
        dispatch(willExecuteQuery()).then(() => {
          dispatch(doSetLoadingState("SUCCESS"));
        }, error => {
          dispatch(doSetLoadingState("FAILURE", error.message));
        });
      }
    }

    return result;
  };
}
