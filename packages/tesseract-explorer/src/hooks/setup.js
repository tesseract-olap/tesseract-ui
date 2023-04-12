import formUrlDecode from "form-urldecoded";
import {useEffect, useMemo, useState} from "react";
import {ensureArray} from "../utils/array";
import {hasOwnProperty} from "../utils/object";
import {parseStateFromSearchParams} from "../utils/permalink";
import {decodeUrlFromBase64} from "../utils/string";
import {buildQuery} from "../utils/structs";
import {isValidQuery} from "../utils/validation";
import {useActions} from "./settings";

/**
 * Keeps in sync the internal datasources with the setup parameters.
 *
 * @param {import("@datawheel/olap-client").ServerConfig} serverConfig
 * @param {string | string[]} locale
 * @param {number} previewLimit
 */
export function useSetup(serverConfig, locale, previewLimit) {
  const actions = useActions();

  const [done, setDone] = useState(false);

  // ensure the locale variable is an array
  const cleanLocale = useMemo(() => typeof locale === "string"
    ? locale.split(",").map(item => item.trim())
    : ensureArray(locale).map(item => item.trim())
  , [`${locale}`]);

  // Keep the locale list in sync with the server state
  useEffect(() => {
    actions.updateLocaleList(cleanLocale);
  }, [cleanLocale]);

  // Initialize the internal state, from permalink, history API, or default.
  useEffect(() => {
    actions.setLoadingState("FETCHING");
    setDone(false);

    actions.willSetupClient(serverConfig)
      .then(() => actions.willReloadCubes())
      .then(cubeMap => {
        let query;
        const searchString = window.location.search;
        const historyState = window.history.state;

        if (searchString) {
          // The current URL contains search params, parse them
          // We need to decode them using this function, as reconstructs arrays
          /** @type {SerializedQuery} */
          const searchObject = formUrlDecode(searchString);

          if (searchObject.query) {
          // Search params are a base64-encoded OLAP server URL
            const decodedURL = decodeUrlFromBase64(searchObject.query);
            const url = new URL(decodedURL);
            return actions.willParseQueryUrl(url)
              .then(() => actions.willHydrateParams())
              .then(() => actions.willExecuteQuery());
          }

          // else, search params are a Explorer state permalink
          const locationState = parseStateFromSearchParams(searchObject);
          query = isValidQuery(locationState) && buildQuery({
            params: {...locationState, pagiLimit: previewLimit}
          });
        }
        else if (isValidQuery(historyState)) {
          query = buildQuery({params: {...historyState, pagiLimit: previewLimit}});
        }

        if (!query || !hasOwnProperty(cubeMap, query.params.cube)) {
          const defaultCube = Object.keys(cubeMap)[0];
          return actions.willHydrateParams(defaultCube);
        }

        actions.resetQueries({[query.key]: query});
        return actions.willHydrateParams()
          .then(() => actions.willExecuteQuery());
      })
      .then(() => {
        actions.setLoadingState("SUCCESS");
        setDone(true);
      }, error => {
        console.dir("There was an error during setup:", error);
        actions.setLoadingState("FAILURE", error.message);
        setDone(true);
      });
  }, [serverConfig]);

  return done;
}
