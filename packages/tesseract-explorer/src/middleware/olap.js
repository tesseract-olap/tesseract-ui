import {Client as OLAPClient, TesseractDataSource} from "@datawheel/olap-client";
import {requestControl} from "../state/loading/actions";
import {doCubeUpdate, doLocaleUpdate} from "../state/params/actions";
import {selectCubeName, selectCurrentQueryParams, selectLocale, selectMeasureMap} from "../state/params/selectors";
import {doQueriesClear, doQueriesSelect, doQueriesUpdate} from "../state/queries/actions";
import {selectQueryItems} from "../state/queries/selectors";
import {doCurrentResultUpdate} from "../state/results/actions";
import {doServerUpdate} from "../state/server/actions";
import {selectOlapCubeMap, selectServerEndpoint} from "../state/server/selectors";
import {applyQueryParams, extractQueryParams} from "../utils/query";
import {buildMeasure, buildQuery} from "../utils/structs";
import {keyBy} from "../utils/transform";
import {isValidQuery} from "../utils/validation";
import {CLIENT_DOWNLOAD, CLIENT_HYDRATEQUERY, CLIENT_LOADMEMBERS, CLIENT_PARSE, CLIENT_QUERY, CLIENT_SETCUBE, CLIENT_SETLOCALE, CLIENT_SETUP, doPermalinkUpdate} from "./actions";
import {fetchCutMembers, hydrateDrilldownProperties} from "./utils";

/**
 * Procedure:
 *
 * CLIENT_SETUP
 * The instance of client stored in the middleware gets a server url to work with,
 * and we get the base cube list and some server info to show in the UI.
 *
 * CLIENT_HYDRATEQUERY
 * The default query, already populated with the permalink data or by the browser's
 * history API, gets the remaining info it needs.
 * For this we fill the remaining measures not included in the state, and the remaining
 * info for all the members in each cut.
 *
 * After this, the UI is ready to receive orders.
 *
 * CLIENT_SETCUBE(cubeName)
 * Receives the name of the cube, get the info
 */

/**
 * @typedef ActionMapParams
 * @property {import("redux").AnyAction} action
 * @property {OLAPClient} client
 * @property {import("redux").Dispatch} dispatch
 * @property {() => TessExpl.State.ExplorerState} getState
 * @property {import("redux").Dispatch} next
 */

const actionMap = {

  /**
   * Sets a new DataSource to the client instance, gets the server info, and
   * initializes the general state accordingly.
   * @param {ActionMapParams} param0
   * @param {string} param0.action.payload The URL for the server to use
   */
  [CLIENT_SETUP]: ({action, client, dispatch}) => {
    console.debug("CLIENT_SETUP");
    const {fetchRequest, fetchSuccess, fetchFailure} = requestControl(
      dispatch,
      action
    );
    fetchRequest();

    return Promise.resolve(action.payload)
      .then(OLAPClient.dataSourceFromURL)
      .then(datasource => {
        client.setDataSource(datasource);
        return Promise.all([
          datasource.checkStatus(),
          datasource.fetchCubes()
        ]);
      })
      .then(result => {
        const [serverInfo, cubes] = result;
        const cubeMap = keyBy(cubes, i => i.name);

        dispatch(doServerUpdate({
          ...serverInfo,
          endpoint: serverInfo.software === TesseractDataSource.softwareName
            ? "logiclayer"
            : "aggregate",
          cubeMap
        }));
        fetchSuccess();
        return dispatch({type: CLIENT_HYDRATEQUERY, payload: cubes[0]?.name});
      })
      .then(() => dispatch({type: CLIENT_QUERY}))
      .catch(error => {
        dispatch(
          doServerUpdate({
            online: false,
            software: "",
            url: error.config.url,
            version: ""
          })
        );
        fetchFailure(error);
      });
  },

  /**
   * Reads the current queryState and fills the missing information.
   * @param {ActionMapParams} param0
   * @param {string} param0.action.payload suggested default cube name
   */
  [CLIENT_HYDRATEQUERY]: ({action, client, dispatch, getState}) => {
    console.debug("CLIENT_HYDRATEQUERY");
    const {fetchRequest, fetchSuccess, fetchFailure} = requestControl(dispatch, action);
    fetchRequest();

    const state = getState();
    const cubeMap = selectOlapCubeMap(state);
    const queries = selectQueryItems(state);

    const queryPromises = queries.map(queryItem => {
      const {params} = queryItem;
      const {cube, measures: measureItems} = params;

      // if params.cube is "" (default), use the suggested cube
      // if was set from permalink/state, check if valid, else use suggested
      const cubeName = cube && cubeMap[cube] ? cube : action.payload;

      return client.getCube(cubeName).then(cube => {
        const hasMeasures = Object.keys(measureItems).length > 0;
        const resolvedMeasures = cube.measures.map((measure, index) => {
          const measureItem = measureItems[measure.name];
          return buildMeasure({
            ...measure.toJSON(),
            ...measureItem,
            active: hasMeasures ? measureItem?.active ?? false : !index
          });
        });
        const measures = keyBy(resolvedMeasures, i => i.measure);

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
            measures
          }
        };
      });
    });

    return Promise.all(queryPromises)
      .then(resolvedQueries => {
        const queryMap = keyBy(resolvedQueries, i => i.key);
        dispatch(doQueriesClear(queryMap));
      })
      .then(fetchSuccess, fetchFailure);
  },

  /**
   * Changes the current cube and updates related state
   * If the new cube contains a measure with the same name as a measure in the
   * previous cube, keep its state
   * @param {ActionMapParams} param0
   * @param {string} param0.action.payload cube name
   */
  [CLIENT_SETCUBE]: ({action, client, dispatch, getState}) => {
    console.debug("CLIENT_SETCUBE");
    const state = getState();
    const currentMeasureMap = selectMeasureMap(state);

    /** @type {Record<string, TessExpl.Struct.MeasureItem>} */
    const measures = {};

    return client.getCube(action.payload)
      .then(cube => {
        cube.measures.forEach((measure, index) => {
          const plainMeasure = measure.toJSON();
          const measureName = plainMeasure.name;
          measures[measureName] = buildMeasure({
            ...plainMeasure,
            // currentMeasureMap[measureName] can be undefined
            // @ts-ignore
            active: !index,
            ...currentMeasureMap[measureName],
            uri: plainMeasure.uri
          });
        });

        return dispatch(doCubeUpdate(cube.name, measures));
      });
  },

  /**
   * Intercepts the order to update locale and dispatches the needed actions.
   * @param {ActionMapParams} param0
   * @param {string} param0.action.payload
   */
  [CLIENT_SETLOCALE]: ({action, dispatch, getState}) => {
    console.debug("CLIENT_SETLOCALE");
    const state = getState();
    const locale = selectLocale(state);

    return Promise.resolve(action.payload)
      .then(nextLocale => {
        if (locale.code !== nextLocale) {
          dispatch(doLocaleUpdate(nextLocale));
          return dispatch({type: CLIENT_QUERY});
        }
        return null;
      });
  },

  /**
   * Takes a newly generated CutItem and fills its list of associated members.
   * Returns a copy of the CutItem with its members property filled.
   * @param {ActionMapParams} param0
   * @param {CutItem} param0.action.payload
   */
  [CLIENT_LOADMEMBERS]: ({action, client, getState}) => {
    console.debug("CLIENT_LOADMEMBERS");
    const state = getState();
    const cubeName = selectCubeName(state);
    const locale = selectLocale(state);

    return client.getCube(cubeName)
      .then(cube => fetchCutMembers({
        cube,
        cutItem: action.payload,
        locale: locale.code
      }));
  },

  /**
   * Parses a query URL into a olap-client Query object, then into a QueryParam object
   * and inyects it into a new QueryItem in the UI.
   * @param {ActionMapParams} param0
   */
  [CLIENT_PARSE]: ({action, client, dispatch}) => {
    const {fetchRequest, fetchSuccess, fetchFailure} = requestControl(dispatch, action);
    fetchRequest();

    return client.parseQueryURL(action.payload)
      .then(query => {
        const queryItem = buildQuery({
          params: extractQueryParams(query)
        });

        fetchSuccess();

        dispatch(doQueriesUpdate(queryItem));
        dispatch(doQueriesSelect(queryItem.key));
      })
      .then(null, fetchFailure)
      .then(() => dispatch({type: CLIENT_HYDRATEQUERY}))
      .then(() => dispatch({type: CLIENT_QUERY}));
  },

  /**
   * Executes the current queryState, and store the result in the State
   * @param {ActionMapParams} param0
   */
  [CLIENT_QUERY]: async({action, client, dispatch, getState}) => {
    console.debug("CLIENT_QUERY");
    const state = getState();
    const params = selectCurrentQueryParams(state);

    if (!isValidQuery(params)) return;

    const {fetchRequest, fetchSuccess, fetchFailure} = requestControl(dispatch, action);
    fetchRequest();

    try {
      const cube = await client.getCube(params.cube);
      const query = applyQueryParams(cube.query, params);

      const endpoint = selectServerEndpoint(state);
      const aggregation = await client.execQuery(query, endpoint);
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
      dispatch(doPermalinkUpdate());

      fetchSuccess(aggregation);
    }
    catch (error) {
      dispatch(
        doCurrentResultUpdate({error: error.message})
      );
      fetchFailure(error);
    }
  },

  [CLIENT_DOWNLOAD]: async({action, client, dispatch, getState}) => {
    const state = getState();
    const params = selectCurrentQueryParams(state);

    if (!isValidQuery(params)) return;

    const {fetchRequest, fetchSuccess, fetchFailure} = requestControl(dispatch, action);
    fetchRequest();

    try {
      const cube = await client.getCube(params.cube);
      const query = applyQueryParams(cube.query, params);
      query.setFormat(action.payload);

      const anchor = document.createElement("a");
      anchor.href = query.toString("logiclayer");
      anchor.download = `${cube.name}_${new Date().toISOString()}.${action.payload}`;
      anchor.click();

      fetchSuccess(anchor.href);
    }
    catch (error) {
      dispatch(
        doCurrentResultUpdate({error: error.message})
      );
      fetchFailure(error);
    }
  }
};

/** @type {import("redux").Middleware<{}, TessExpl.State.ExplorerState>} */
function olapClientMiddleware({dispatch, getState}) {
  const client = new OLAPClient();

  return next => action => {
    const effector = actionMap[action.type];
    return typeof effector === "function"
      ? effector({action, client, dispatch, getState, next})
      : next(action);
  };
}

export default olapClientMiddleware;
