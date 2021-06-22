import {createSelector} from "reselect";
import {action} from "../state/helpers";
import {doRawInyect} from "../state/params/actions";
import {selectCurrentQueryParams} from "../state/params/selectors";
import {selectOlapCubeMap} from "../state/server/selectors";
import {serializePermalink} from "../utils/permalink";


const selectPermalink = createSelector(selectCurrentQueryParams, serializePermalink);


export const PERMALINK_UPDATE = "explorer/PERMALINK/UPDATE";


/**
 * Compares the current QueryParams against the browser's URL search params,
 * and updates the latter if there is a mismatch.
 */
export const willUpdatePermalink = () => action(PERMALINK_UPDATE);


/** @type {import("redux").Middleware<{}, TessExpl.State.ExplorerState>} */
export function permalinkMiddleware(api) {
  if (typeof window !== "object") {
    return next => action => next(action);
  }

  window.addEventListener("popstate", evt => {
    evt.state && api.dispatch(doRawInyect(evt.state));
  });

  // eslint-disable-next-line consistent-return
  return next => action => {
    if (action.type !== PERMALINK_UPDATE) {
      return next(action);
    }

    const state = api.getState();
    const cubeMap = selectOlapCubeMap(state);
    const params = selectCurrentQueryParams(state);

    if (cubeMap[params.cube] != null) {
      const nextPermalink = selectPermalink(state);

      if (window.location.search.slice(1) !== nextPermalink) {
        const nextLocation = `${window.location.pathname}?${nextPermalink}`;
        window.history.pushState(params, "", nextLocation);
      }
    }
  };
}
