import formUrlDecode from "form-urldecoded";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {willExecuteQuery, willHydrateParams, willParseQueryUrl, willReloadCubes, willSetupClient} from "../middleware/olapActions";
import {doSetLoadingState} from "../state/loading/actions";
import {doQueriesClear} from "../state/queries/actions";
import {updateLocaleList} from "../state/server/actions";
import {parseStateFromSearchParams} from "../utils/permalink";
import {decodeUrlFromBase64} from "../utils/string";
import {buildQuery} from "../utils/structs";
import {isValidQuery} from "../utils/validation";

/**
 * Keeps in sync the internal datasources with the setup parameters.
 *
 * @param {OlapClient.ServerConfig} serverConfig
 * @param {string[]} locale
 */
export function useSetup(serverConfig, locale) {
  const dispatch = useDispatch();

  const [done, setDone] = useState(false);

  useEffect(() => {
    dispatch(updateLocaleList(locale));
  }, [locale.join(",")]);

  useEffect(() => {
    dispatch(doSetLoadingState("REQUEST"));
    setDone(false);

    dispatch(willSetupClient(serverConfig))
      .then(() => dispatch(willReloadCubes()))
      .then(cubeMap => {
        let query;
        const searchString = window.location.search;
        const historyState = window.history.state;

        if (searchString) {
          // The current URL contains search params, parse them
          // We need to decode them using this function, as reconstructs arrays
          /** @type {TessExpl.Struct.SerializedQuery} */
          const searchObject = formUrlDecode(searchString);

          if (searchObject.query) {
          // Search params are a base64-encoded OLAP server URL
            const decodedURL = decodeUrlFromBase64(searchObject.query);
            const url = new URL(decodedURL);
            return dispatch(willParseQueryUrl(url))
              .then(() => dispatch(willHydrateParams()))
              .then(() => dispatch(willExecuteQuery()));
          }

          // else, search params are a Explorer state permalink
          const locationState = parseStateFromSearchParams(searchObject);
          query = isValidQuery(locationState) && buildQuery({params: locationState});
        }
        else if (isValidQuery(historyState)) {
          query = buildQuery({params: historyState});
        }

        if (!query || !cubeMap.hasOwnProperty(query.params.cube)) {
          const defaultCube = Object.keys(cubeMap)[0];
          return dispatch(willHydrateParams(defaultCube));
        }

        dispatch(doQueriesClear({[query.key]: query}));
        return dispatch(willHydrateParams())
          .then(() => dispatch(willExecuteQuery()));
      })
      .then(() => {
        dispatch(doSetLoadingState("SUCCESS"));
        setDone(true);
      }, error => {
        console.dir("There was an error during setup:", error);
        dispatch(doSetLoadingState("FAILURE", error.message));
        setDone(true);
      });
  }, [serverConfig]);

  return done;
}
