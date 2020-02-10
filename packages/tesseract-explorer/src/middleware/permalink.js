import {doRawInyect} from "../state/params/actions";
import {selectCurrentQueryParams} from "../state/params/selectors";
import {selectOlapCubeMap} from "../state/server/selectors";
import {PERMALINK_REFRESH, PERMALINK_UPDATE} from "./actions";
import {selectPermalink} from "./selectors";

const effectors = {
  [PERMALINK_REFRESH]: ({getState}) => {
    const state = getState();
    const params = selectCurrentQueryParams(state);
    const permalink = selectPermalink(state);
    const url = `${window.location.pathname}?${permalink}`;
    window.history.pushState(params, "", url);
  },

  [PERMALINK_UPDATE]: ({getState}) => {
    const state = getState();
    const cubeMap = selectOlapCubeMap(state);
    const params = selectCurrentQueryParams(state);

    if (cubeMap[params.cube] != null) {
      const nextPermalink = selectPermalink(state);

      if (window.location.search.slice(1) !== nextPermalink) {
        console.groupCollapsed("Permalink changed");
        console.log(params);
        console.groupEnd();

        const nextLocation = `${window.location.pathname}?${nextPermalink}`;
        window.history.pushState(params, "", nextLocation);
      }
    }
    return undefined;
  }
};

/** @type {import("redux").Middleware<{}, ExplorerState>} */
function permalinkMiddleware(api) {
  if (typeof window === "object") {
    window.addEventListener("popstate", evt => {
      evt.state && api.dispatch(doRawInyect(evt.state));
    });
    return next => action => action.type in effectors ? effectors[action.type](api) : next(action);
  }
  return next => action => next(action);
}

export default permalinkMiddleware;
