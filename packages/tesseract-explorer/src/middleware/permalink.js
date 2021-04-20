import formUrlDecode from "form-urldecoded";
import {doRawInyect} from "../state/params/actions";
import {selectCurrentQueryParams} from "../state/params/selectors";
import {doQueriesClear} from "../state/queries/actions";
import {selectOlapCubeMap} from "../state/server/selectors";
import {parseStateFromSearchParams} from "../utils/permalink";
import {decodeUrlFromBase64} from "../utils/string";
import {buildQuery} from "../utils/structs";
import {isValidQuery} from "../utils/validation";
import {doParseQueryUrl, PERMALINK_PARSE, PERMALINK_REFRESH, PERMALINK_UPDATE} from "./actions";
import {selectPermalink} from "./selectors";

const permalinkEffectors = {
  [PERMALINK_PARSE]: ({dispatch}) => {
    if (typeof window === "object") {
      let query;

      const searchString = window.location.search;
      if (searchString) {

        /** @type {TessExpl.Struct.SerializedQuery} */
        const searchObject = formUrlDecode(searchString);
        if (searchObject.query) {
          const decodedURL = decodeUrlFromBase64(searchObject.query);
          const url = new URL(decodedURL);
          return dispatch(doParseQueryUrl(url));
        }
        const locationState = parseStateFromSearchParams(searchObject);
        query = isValidQuery(locationState) && buildQuery({params: locationState});
      }
      else if (window.history.state) {
        const historyState = window.history.state;
        query = isValidQuery(historyState) && buildQuery({params: historyState});
      }

      if (query) {
        dispatch(doQueriesClear({[query.key]: query}));
      }
    }
    return undefined;
  },

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
        const nextLocation = `${window.location.pathname}?${nextPermalink}`;
        window.history.pushState(params, "", nextLocation);
      }
    }
    return undefined;
  }
};

/** @type {import("redux").Middleware<{}, TessExpl.State.ExplorerState>} */
function permalinkMiddleware(api) {
  if (typeof window !== "object") {
    return next => action => next(action);
  }
  window.addEventListener("popstate", evt => {
    evt.state && api.dispatch(doRawInyect(evt.state));
  });
  return next => action => action.type in permalinkEffectors
    ? permalinkEffectors[action.type](api)
    : next(action);
}

export default permalinkMiddleware;
