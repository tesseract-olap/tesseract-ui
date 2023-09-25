import {Format, LevelDescriptor, Client as OLAPClient, PlainCube, PlainMember, ServerConfig, TesseractDataSource} from "@datawheel/olap-client";
import {filterMap} from "../utils/array";
import {applyQueryParams, extractQueryParams} from "../utils/query";
import {QueryItem, buildMeasure, buildQuery} from "../utils/structs";
import {keyBy} from "../utils/transform";
import {FileDescriptor} from "../utils/types";
import {isValidQuery} from "../utils/validation";
import {loadingActions} from "./loading";
import {queriesActions, selectCubeName, selectCurrentQueryParams, selectLocale, selectMeasureKeys, selectQueryItems} from "./queries";
import {selectOlapCubeMap, selectServerEndpoint, serverActions} from "./server";
import {ExplorerThunk} from "./store";
import {calcMaxMemberCount, hydrateDrilldownProperties} from "./utils";
import {describeData} from "../utils/object";

/**
 * Initiates a new download of the queried data by the current parameters.
 *
 * @param format
 *   The format the user wants the data to be. Must be a string equal to one
 *   in OlapClient.Format.
 */
export function willDownloadQuery(
  format: Format
): ExplorerThunk<Promise<FileDescriptor>> {
  return (dispatch, getState, {olapClient, previewLimit}) => {
    const state = getState();
    const params = selectCurrentQueryParams(state);

    if (!isValidQuery(params)) {
      return Promise.reject(new Error("The current query is not valid."));
    }

    const axios = olapClient.datasource.axiosInstance;

    return olapClient.getCube(params.cube)
      .then(cube => {
        const filename = `${cube.name}_${new Date().toISOString()}`;
        const query = applyQueryParams(cube.query, params, {previewLimit}).setFormat(format);

        return Promise.all([
          axios({url: query.toString("logiclayer"), responseType: "blob"})
            .then(response => response.data),
          calcMaxMemberCount(query, params)
            .then(maxRows => {
              if (maxRows > 50000) {
                dispatch(
                  loadingActions.setLoadingMessage({type: "HEAVY_QUERY", rows: maxRows})
                );
              }
            })
        ]).then(result => ({
          content: result[0],
          extension: format.replace(/json\w+/, "json"),
          name: filename
        }));
      });
  };
}

/**
 * Takes the current parameters, and queries the OLAP server for data with them.
 * The result is stored in QueryItem["result"].
 * This operation does not activate the Loading overlay in the UI; you must use
 * `willRequestQuery()` for that.
 */
export function willExecuteQuery(): ExplorerThunk<Promise<void>> {
  return (dispatch, getState, {olapClient, previewLimit}) => {
    const state = getState();
    const params = selectCurrentQueryParams(state);
    const endpoint = selectServerEndpoint(state);

    if (!isValidQuery(params)) return Promise.resolve();

    return olapClient.getCube(params.cube)
      .then(cube => {
        const query = applyQueryParams(cube.query, params, {previewLimit});
        return Promise.all([
          olapClient.execQuery(query, endpoint),
          calcMaxMemberCount(query, params).then(maxRows => {
            if (maxRows > 50000) {
              dispatch(loadingActions.setLoadingMessage({type: "HEAVY_QUERY", rows: maxRows}));
            }
          })
        ]).then(result => {
          const [aggregation] = result;
          dispatch(
            queriesActions.updateResult({
              data: aggregation.data,
              types: describeData(cube.toJSON(), params, aggregation.data),
              headers: aggregation.headers || {},
              sourceCall: query.toSource(),
              status: aggregation.status || 500,
              url: query.toString(endpoint)
            })
          );
        }, error => {
          dispatch(queriesActions.updateResult({
            data: [],
            types: {},
            error: error.message,
            status: error?.response?.status ?? 500,
            url: query.toString(endpoint)
          }));
        });
      });
  };
}

/**
 * Requests the list of associated Members for a certain Level.
 *
 * @param levelRef
 *   The descriptor to the Level for whom we want to retrieve members.
 */
export function willFetchMembers(
  levelRef: LevelDescriptor
): ExplorerThunk<Promise<PlainMember[]>> {
  return (dispatch, getState, {olapClient}) => {
    const state = getState();
    const cubeName = selectCubeName(state);
    const locale = selectLocale(state);

    return olapClient.getCube(cubeName)
      .then(cube => {
        const level = cube.getLevel(levelRef);
        return cube.datasource.fetchMembers(level, {locale: locale.code});
      })
      .catch(() => {
        const serialRef = JSON.stringify(levelRef);
        console.error(`Couldn't find level from reference: ${serialRef}`);
        return [];
      });
  };
}

/**
 * Checks the state of the current QueryParams and fills missing information.
 *
 * @param suggestedCube
 *   The cube to resolve the missing data from.
 */
export function willHydrateParams(
  suggestedCube?: string
): ExplorerThunk<Promise<void>> {
  return (dispatch, getState, {olapClient}) => {
    const state = getState();
    const cubeMap = selectOlapCubeMap(state);
    const queries = selectQueryItems(state);

    const queryPromises = queries.map(queryItem => {
      const {params} = queryItem;
      const {cube: paramCube, measures: measureItems} = params;

      // if params.cube is "" (default), use the suggested cube
      // if was set from permalink/state, check if valid, else use suggested
      /* eslint-disable indent, operator-linebreak */
      const cubeName =
        paramCube && cubeMap[paramCube]         ? paramCube :
        suggestedCube && cubeMap[suggestedCube] ? suggestedCube :
        /* else                              */   Object.keys(cubeMap)[0];
      /* eslint-enable */

      return olapClient.getCube(cubeName)
        .then((cube): QueryItem => {
          const resolvedMeasures = cube.measures
            .map(measure => buildMeasure({
              active: measure.name in measureItems,
              key: measure.name,
              name: measure.name
            }));
          const resolvedDrilldowns = filterMap(Object.values(params.drilldowns), item =>
            hydrateDrilldownProperties(cube, item) || null
          );

          return {
            ...queryItem,
            params: {
              ...params,
              cube: cubeName,
              drilldowns: keyBy(resolvedDrilldowns, item => item.key),
              measures: keyBy(resolvedMeasures, item => item.key)
            }
          };
        });
    });

    return Promise.all(queryPromises)
      .then(resolvedQueries => {
        const queryMap = keyBy(resolvedQueries, i => i.key);
        dispatch(queriesActions.resetQueries(queryMap));
      });
  };
}

/**
 * Parses a query URL into a olap-client Query object, then into a QueryParam
 * object, and inyects it into a new QueryItem in the UI.
 */
export function willParseQueryUrl(
  url: string | URL
): ExplorerThunk<Promise<void>> {
  return (dispatch, getState, {olapClient}) =>
    olapClient.parseQueryURL(url.toString(), {anyServer: true})
      .then(query => {
        const queryItem = buildQuery({
          params: extractQueryParams(query)
        });
        dispatch(queriesActions.updateQuery(queryItem));
        dispatch(queriesActions.selectQuery(queryItem.key));
      });
}

/**
 * Performs a full replacement of the cubes stored in the state with fresh data
 * from the server.
 */
export function willReloadCubes(): ExplorerThunk<Promise<{[k: string]: PlainCube}>> {
  return (dispatch, getState, {olapClient}) => olapClient.getCubes()
    .then(cubes => {
      const plainCubes = filterMap(cubes, cube =>
        cube.annotations.hide_in_ui === "true" ? null : cube.toJSON()
      );
      const cubeMap = keyBy(plainCubes, i => i.name);
      dispatch(serverActions.updateServer({cubeMap}));
      return cubeMap;
    });
}

/**
 * Executes the full Query request procedure, including the calls to activate
 * the loading overlay.
 */
export function willRequestQuery(): ExplorerThunk<Promise<void>> {
  return (dispatch, getState) => {
    const state = getState();
    const params = selectCurrentQueryParams(state);

    if (!isValidQuery(params)) return Promise.resolve();

    dispatch(loadingActions.setLoadingState("FETCHING"));
    return dispatch(willExecuteQuery()).then(() => {
      dispatch(loadingActions.setLoadingState("SUCCESS"));
    }, error => {
      dispatch(loadingActions.setLoadingState("FAILURE", error.message));
    });
  };
}

/**
 * Changes the current cube and updates related state
 * If the new cube contains a measure with the same name as a measure in the
 * previous cube, keep its state.
 *
 * @param cubeName
 *   The name of the cube we intend to switch to.
 */
export function willSetCube(cubeName: string): ExplorerThunk<Promise<void>> {
  return (dispatch, getState, {olapClient}) => {
    const state = getState();
    const currentMeasures = selectMeasureKeys(state);

    return olapClient.getCube(cubeName)
      .then(cube => {
        const measures = filterMap(cube.measures, measure => buildMeasure({
          active: currentMeasures.includes(measure.name),
          ...measure.toJSON()
        }));
        dispatch(queriesActions.updateCube({
          cube: cube.name,
          measures: keyBy(measures, item => item.key)
        }));
      });
  };
}

/**
 * Setups data server configuration on the global client instance.
 * Sets a new DataSource to the client instance, gets the server info, and
 * initializes the general state accordingly.
 */
export function willSetupClient(
  serverConfig: ServerConfig
): ExplorerThunk<Promise<void>> {
  return (dispatch, getState, {olapClient: client}) =>
    OLAPClient.dataSourceFromURL(serverConfig)
      .then(datasource => {
        client.setDataSource(datasource);
        return client.checkStatus();
      })
      .then(serverInfo => {
        dispatch(serverActions.updateServer({
          online: serverInfo.online,
          software: serverInfo.software,
          url: serverInfo.url,
          version: serverInfo.version,
          endpoint: serverInfo.software === TesseractDataSource.softwareName
            ? "logiclayer"
            : "aggregate"
        }));
      }, error => {
        dispatch(serverActions.updateServer({
          online: false,
          software: "",
          url: error.config.url,
          version: ""
        }));
        throw error;
      });
}
