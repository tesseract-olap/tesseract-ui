import {Client as OLAPClient, TesseractDataSource} from "@datawheel/olap-client";
import {doSetLoadingMessage, doSetLoadingState} from "../state/loading/actions";
import {doCubeUpdate} from "../state/params/actions";
import {selectCubeName, selectCurrentQueryParams, selectLocale, selectMeasureItems} from "../state/params/selectors";
import {doQueriesClear, doQueriesSelect, doQueriesUpdate} from "../state/queries/actions";
import {selectQueryItems} from "../state/queries/selectors";
import {doCurrentResultUpdate} from "../state/results/actions";
import {doServerUpdate} from "../state/server/actions";
import {selectOlapCubeMap, selectServerEndpoint} from "../state/server/selectors";
import {filterMap} from "../utils/array";
import {applyQueryParams, extractQueryParams} from "../utils/query";
import {buildQuery} from "../utils/structs";
import {keyBy} from "../utils/transform";
import {isValidQuery} from "../utils/validation";
import {willUpdatePermalink} from "./permalink";
import {calcMaxMemberCount, hydrateDrilldownProperties} from "./utils";


export const CLIENT_DOWNLOADQUERY = "explorer/CLIENT/DOWNLOADQUERY";
export const CLIENT_EXECUTEQUERY = "explorer/CLIENT/EXECUTEQUERY";
export const CLIENT_FETCHMEMBERS = "explorer/CLIENT/FETCHMEMBERS";
export const CLIENT_FILLPARAMS = "explorer/CLIENT/FILLPARAMS";
export const CLIENT_PARSEQUERYURL = "explorer/CLIENT/PARSEQUERYURL";
export const CLIENT_RELOADCUBES = "explorer/CLIENT/RELOADCUBES";
export const CLIENT_REQUESTQUERY = "explorer/CLIENT/REQUESTQUERY";
export const CLIENT_SELECTCUBE = "explorer/CLIENT/SELECTCUBE";
export const CLIENT_SETUPSERVER = "explorer/CLIENT/SETUPSERVER";


export const olapEffectors = {
  [CLIENT_DOWNLOADQUERY]: olapMiddlewareDownloadQuery,
  [CLIENT_EXECUTEQUERY]: olapMiddlewareExecuteQuery,
  [CLIENT_FETCHMEMBERS]: olapMiddlewareFetchMembers,
  [CLIENT_FILLPARAMS]: olapMiddlewareFillParams,
  [CLIENT_PARSEQUERYURL]: olapMiddlewareParseQuery,
  [CLIENT_RELOADCUBES]: olapMiddlewareReloadCubes,
  [CLIENT_REQUESTQUERY]: olapMiddlewareRequestQuery,
  [CLIENT_SELECTCUBE]: olapMiddlewareSelectCube,
  [CLIENT_SETUPSERVER]: olapMiddlewareSetupServer
};


/**
 * Initiates a new download of the queried data by the current parameters.
 *
 * @param {EffectorAPI} param
 * @param {PayloadAction<CLIENT_DOWNLOADQUERY, OlapClient.Format>} action Payload is the format the user wants the data to be, from OlapClient.Format.
 * @returns {Promise<TessExpl.Struct.FileDescriptor>}
 */
function olapMiddlewareDownloadQuery({client, dispatch, getState}, action) {
  const state = getState();
  const params = selectCurrentQueryParams(state);
  const format = action.payload;

  if (!isValidQuery(params)) {
    return Promise.reject(new Error("The current query is not valid."));
  }

  const axios = client.datasource.axiosInstance;

  return client.getCube(params.cube)
    .then(cube => {
      const filename = `${cube.name}_${new Date().toISOString()}`;
      const query = applyQueryParams(cube.query, params).setFormat(format);

      return Promise.all([
        axios({url: query.toString("logiclayer"), responseType: "blob"})
          .then(response => response.data),
        calcMaxMemberCount(query, params)
          .then(maxRows => {
            if (maxRows > 50000) {
              dispatch(doSetLoadingMessage({type: "HEAVY_QUERY", rows: maxRows}));
            }
          })
      ]).then(result => {
        return {
          content: result[0],
          extension: format.replace(/json\w+/, "json"),
          name: filename
        }
      });
    });
}

/**
 * Executes the full query request procedure, including the calls to activate
 * the loading overlay.
 *
 * @param {EffectorAPI} api
 */
function olapMiddlewareRequestQuery(api) {
  const {dispatch, getState} = api;
  const state = getState();
  const params = selectCurrentQueryParams(state);

  if (!isValidQuery(params)) return Promise.resolve();

  dispatch(doSetLoadingState("REQUEST"));
  return olapMiddlewareExecuteQuery(api).then(() => {
    dispatch(doSetLoadingState("SUCCESS"));
  }, error => {
    dispatch(doSetLoadingState("FAILURE", error.message));
  });
}


/**
 * Executes the current queryState, and saves the result in the store.
 *
 * @param {EffectorAPI} param
 */
function olapMiddlewareExecuteQuery({client, dispatch, getState}) {
  const state = getState();
  const params = selectCurrentQueryParams(state);

  if (!isValidQuery(params)) return Promise.resolve();

  return client.getCube(params.cube)
    .then(cube => {
      const query = applyQueryParams(cube.query, params);
      const endpoint = selectServerEndpoint(state);
      return Promise.all([
        client.execQuery(query, endpoint),
        calcMaxMemberCount(query, params).then(maxRows => {
          if (maxRows > 50000) {
            dispatch(doSetLoadingMessage({type: "HEAVY_QUERY", rows: maxRows}));
          }
        })
      ]);
    })
    .then(result => {
      const [aggregation] = result;
      const query = aggregation.query;
      dispatch(
        doCurrentResultUpdate({
          data: aggregation.data,
          error: null,
          headers: aggregation.headers || {},
          sourceCall: query.toSource(),
          status: aggregation.status,
          urlAggregate: query.toString("aggregate"),
          urlLogicLayer: query.toString("logiclayer")
        })
      );

      return dispatch(willUpdatePermalink());
    })
    .catch(error => {
      dispatch(doCurrentResultUpdate({error: error.message}));
    });
}


/**
 * Takes a newly generated CutItem and fills its list of associated members.
 * Returns a copy of the CutItem with its members property filled.
 *
 * @param {EffectorAPI} param
 * @param {PayloadAction<CLIENT_FETCHMEMBERS, TessExpl.Struct.LevelReference>} action Payload is the cutItem to complete
 */
function olapMiddlewareFetchMembers({client, getState}, action) {
  const state = getState();
  const cubeName = selectCubeName(state);
  const locale = selectLocale(state);

  return client.getCube(cubeName).then(cube => {
    const ref = action.payload;
    let level;
    try {
      level = cube.getLevel({
        dimension: ref.dimension,
        hierarchy: ref.hierarchy,
        level: "name" in ref ? ref.name : ref.level
      });
    }
    catch {
      const serialRef = JSON.stringify(ref);
      throw new Error(`Couldn't find level from reference: ${serialRef}`);
    }

    return cube.datasource.fetchMembers(level, {locale: locale.code});
  });
}


/**
 * Reads the current queryState and fills the missing information.
 *
 * @param {EffectorAPI} param
 * @param {PayloadAction<CLIENT_FILLPARAMS, string>} action Payload is a suggested default cube name
 */
function olapMiddlewareFillParams({client, dispatch, getState}, action) {
  const state = getState();
  const cubeMap = selectOlapCubeMap(state);
  const queries = selectQueryItems(state);

  const queryPromises = queries.map(queryItem => {
    const {params} = queryItem;
    const {cube, measures: measureItems} = params;

    // if params.cube is "" (default), use the suggested cube
    // if was set from permalink/state, check if valid, else use suggested
    /* eslint-disable indent, operator-linebreak */
    const cubeName =
      cube && cubeMap[cube]                     ? cube :
      action.payload && cubeMap[action.payload] ? action.payload :
      /* else                                */   Object.keys(cubeMap)[0];
    /* eslint-enable */

    return client.getCube(cubeName).then(cube => {
      const resolvedMeasures = filterMap(cube.measures, measure =>
        measureItems.includes(measure.name) ? measure.name : null
      );
      const resolvedDrilldowns = Object.values(params.drilldowns)
        .map(drilldownItem =>
          hydrateDrilldownProperties(cube, drilldownItem)
        )
        .filter(Boolean);
      const drilldowns = keyBy(resolvedDrilldowns, i => i.key);

      return {
        ...queryItem,
        params: {
          ...params,
          cube: cubeName,
          drilldowns,
          measures: resolvedMeasures
        }
      };
    });
  });

  return Promise.all(queryPromises)
    .then(resolvedQueries => {
      const queryMap = keyBy(resolvedQueries, i => i.key);
      dispatch(doQueriesClear(queryMap));
    });
}


/**
 * Parses a query URL into a olap-client Query object, then into a QueryParam
 * object, and inyects it into a new QueryItem in the UI.
 *
 * @param {EffectorAPI} param
 * @param {PayloadAction<CLIENT_PARSEQUERYURL, string>} action Payload is the URL to parse
 */
function olapMiddlewareParseQuery({client, dispatch}, action) {
  return client.parseQueryURL(action.payload, {anyServer: true})
    .then(query => {
      const queryItem = buildQuery({
        params: extractQueryParams(query)
      });
      dispatch(doQueriesUpdate(queryItem));
      dispatch(doQueriesSelect(queryItem.key));
    });
}


/**
 *
 * @param {EffectorAPI} param
 */
function olapMiddlewareReloadCubes({client, dispatch}) {
  return client.getCubes()
    .then(cubes => {
      const plainCubes = filterMap(cubes, cube =>
        cube.annotations.hide_in_ui === "true" ? null : cube.toJSON()
      );
      const cubeMap = keyBy(plainCubes, i => i.name);
      dispatch(doServerUpdate({cubeMap}));
      return cubeMap;
    });
}


/**
 * Changes the current cube and updates related state
 * If the new cube contains a measure with the same name as a measure in the
 * previous cube, keep its state
 *
 * @param {EffectorAPI} param
 * @param {PayloadAction<CLIENT_SELECTCUBE, string>} action
 * Payload is the name of the next current cube
 */
function olapMiddlewareSelectCube({client, dispatch, getState}, action) {
  const state = getState();
  const currentMeasures = selectMeasureItems(state);

  return client.getCube(action.payload)
    .then(cube => {
      const measures = filterMap(cube.measures, measure =>
        currentMeasures.includes(measure.name) ? measure.name : null
      );
      dispatch(doCubeUpdate(cube.name, measures));
    });
}


/**
 * Sets a new DataSource to the client instance, gets the server info, and
 * initializes the general state accordingly.
 *
 * @param {EffectorAPI} param
 * @param {PayloadAction<CLIENT_SETUPSERVER, OlapClient.ServerConfig>} action Payload is an OlapClient.ServerConfig to set in the middleware's OlapClient.Client instance.
 */
function olapMiddlewareSetupServer({client, dispatch}, action) {
  return OLAPClient.dataSourceFromURL(action.payload)
    .then(datasource => {
      client.setDataSource(datasource);
      return client.checkStatus();
    })
    .then(serverInfo => {
      dispatch(doServerUpdate({
        online: serverInfo.online,
        software: serverInfo.software,
        url: serverInfo.url,
        version: serverInfo.version,
        endpoint: serverInfo.software === TesseractDataSource.softwareName
          ? "logiclayer"
          : "aggregate"
      }));
    }, error => {
      dispatch(doServerUpdate({
        online: false,
        software: "",
        url: error.config.url,
        version: ""
      }));
      throw error;
    });
}


/**
 * @typedef EffectorAPI
 * @property {OlapClient.Client} client
 * @property {import("redux").Dispatch} dispatch
 * @property {() => TessExpl.State.ExplorerState} getState
 * @property {import("redux").Dispatch} next
 */

/**
 * @template {string} T
 * @template U
 * @typedef PayloadAction
 * @property {T} type
 * @property {U} payload
 */
