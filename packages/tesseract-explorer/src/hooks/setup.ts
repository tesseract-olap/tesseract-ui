import {ServerConfig} from "@datawheel/olap-client";
import formUrlDecode from "form-urldecoded";
import {useMemo, useState} from "react";
import {asArray} from "../utils/array";
import {hasOwnProperty} from "../utils/object";
import {SerializedQuery, parseStateFromSearchParams} from "../utils/permalink";
import {decodeUrlFromBase64} from "../utils/string";
import {buildQuery, buildQueryParams} from "../utils/structs";
import {isValidQuery} from "../utils/validation";
import {ExplorerBoundActionMap, useActions} from "./settings";

/**
 * Encapsulates the startup logic for the whole app.
 * Also keeps in sync the internal datasources with the setup parameters.
 */
export function useSetup(
  serverConfig: ServerConfig,
  locale: string | string[] | undefined
) {
  const actions = useActions();

  const [done, setDone] = useState(false);

  // Ensure the `locale` variable is an array,
  // keep the value in sync with the server state
  const cleanLocale = useMemo(() => {
    const normLocale = asArray(locale ? `${locale}`.split(",") : []);
    const cleanLocale = normLocale.map(item => item.trim());
    actions.updateLocaleList(cleanLocale);
    return cleanLocale;
  }, [`${locale}`]);

  // Initialize the internal state; must run just once and only on browser.
  useMemo(() => {
    if (typeof window !== "object") return;

    actions.setLoadingState("FETCHING");

    Promise.all([
      getInitialQuery(actions),
      actions.willSetupClient(serverConfig)
        .then(() => actions.willReloadCubes())
    ]).then(result => {
      const [query, cubeMap] = result;

      if (!query || !hasOwnProperty(cubeMap, query.params.cube)) {
        const defaultCube = Object.keys(cubeMap)[0];
        return actions.willHydrateParams(defaultCube);
      }

      query.params.locale = query.params.locale || cleanLocale[0];
      actions.resetQueries({[query.key]: query});
      return actions.willHydrateParams()
        .then(() => actions.willExecuteQuery());
    }).then(() => {
      actions.setLoadingState("SUCCESS");
      setDone(true);
    }, error => {
      console.dir("There was an error during setup:", error);
      actions.setLoadingState("FAILURE", error.message);
      setDone(true);
    });
  }, []);

  return done;
}

/**
 * Resolves the initial state of the App, based on the state stored on a
 * permalink or the browser's history data.
 */
function getInitialQuery(actions: ExplorerBoundActionMap) {
  if (typeof window === "object") {
    const searchString = window.location.search;
    if (searchString) {
      // The current URL contains search params, parse them
      // We need to decode them using this function, as reconstructs arrays
      const searchObject = formUrlDecode<SerializedQuery | {query: string}>(searchString);

      if ("query" in searchObject) {
      // Search params are a base64-encoded OLAP server URL
        const decodedURL = decodeUrlFromBase64(searchObject.query);
        const url = new URL(decodedURL);
        return actions.willParseQueryUrl(url);
      }

      // else, search params are a Explorer state permalink
      const locationState = parseStateFromSearchParams(searchObject);
      if (isValidQuery(locationState)) {
        return buildQuery({
          panel: searchObject.panel,
          params: buildQueryParams({...locationState})
        });
      }
    }

    const historyState = window.history.state;
    if (isValidQuery(historyState)) {
      return buildQuery({params: {...historyState}});
    }
  }

  return undefined;
}
