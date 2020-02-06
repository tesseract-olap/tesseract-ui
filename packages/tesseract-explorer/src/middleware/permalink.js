import {PERMALINK_REFRESH, PERMALINK_UPDATE} from "../actions/permalink";
import {queryInyect} from "../actions/query";
import {selectPermalink} from "../selectors/permalink";
import {selectQueryState, selectCubesState} from "../selectors/state";

const effectors = {
  [PERMALINK_REFRESH]: ({getState}) => {
    const state = getState();
    const params = selectQueryState(state);
    const permalink = selectPermalink(state);
    if (window.location.search !== `?${permalink}`) {
      const url = `${window.location.pathname}?${permalink}`;
      window.history.pushState(params, "", url);
    }
  },

  [PERMALINK_UPDATE]: ({getState}) => {
    const state = getState();
    const cubeMap = selectCubesState(state);
    const params = selectQueryState(state);

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

/** @type {import("redux").Middleware<{}, import("../reducers").ExplorerState>} */
function permalinkMiddleware(api) {
  if (typeof window === "object") {
    window.addEventListener("popstate", evt => {
      evt.state && api.dispatch(queryInyect(evt.state));
    });
    return next => action => action.type in effectors ? effectors[action.type](api) : next(action);
  }
  return next => action => next(action);
}

export default permalinkMiddleware;
