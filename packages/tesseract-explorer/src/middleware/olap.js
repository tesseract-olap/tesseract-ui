import {Client as OLAPClient, DimensionType, Level} from "@datawheel/olap-client";
import {chartInterfaces} from "../enums";
import {requestControl} from "../state/loading/actions";
import {doCubeUpdate, doCutClear, doCutUpdate, doLocaleUpdate} from "../state/params/actions";
import {selectCubeName, selectCurrentQueryParams, selectCutItems, selectLocaleCode, selectMeasureMap} from "../state/params/selectors";
import {doQueriesClear, doQueriesUpdate, doQueriesSelect} from "../state/queries/actions";
import {selectQueryItems} from "../state/queries/selectors";
import {doCurrentResultUpdate} from "../state/results/actions";
import {selectChartConfigText, selectChartType} from "../state/results/selectors";
import {doServerUpdate} from "../state/server/actions";
import {selectOlapCubeMap} from "../state/server/selectors";
import {applyQueryParams, extractQueryParams} from "../utils/query";
import {buildChartConfig} from "../utils/string";
import {buildMeasure, buildQuery} from "../utils/structs";
import {keyBy} from "../utils/transform";
import {isValidQuery} from "../utils/validation";
import {CLIENT_HYDRATEQUERY, CLIENT_LOADMEMBERS, CLIENT_QUERY, CLIENT_SETCUBE, CLIENT_SETLOCALE, CLIENT_SETUP, doPermalinkUpdate, CLIENT_PARSE} from "./actions";
import {hydrateCutMembers, hydrateDrilldownProperties} from "./utils";

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
 * @property {() => ExplorerState} getState
 * @property {import("redux").Dispatch} next
 */

const actionMap = {

  /**
   * Sets a new DataSource to the client instance, gets the server info, and
   * initializes the general state accordingly.
   * @param {ActionMapParams} param0
   * @param {string} param0.action.payload The URL for the server to use
   */
  [CLIENT_SETUP]: async({action, client, dispatch}) => {
    console.log("CLIENT_SETUP");
    const {fetchRequest, fetchSuccess, fetchFailure} = requestControl(
      dispatch,
      action
    );
    fetchRequest();

    try {
      const datasource = await OLAPClient.dataSourceFromURL(action.payload);
      client.setDataSource(datasource);

      const serverInfo = await client.checkStatus();
      const cubes = await client.getCubes();

      /** @type {Record<string, OlapCube>} */
      const cubeMap = {};

      let cube,
          n = cubes.length;
      while (n--) {
        cube = cubes[n].toJSON();
        cubeMap[cube.name] = cube;
      }

      dispatch(doServerUpdate({...serverInfo, cubeMap}));
      fetchSuccess();

      await dispatch({type: CLIENT_HYDRATEQUERY, payload: cube && cube.name});
      await dispatch({type: CLIENT_QUERY});
    }
    catch (error) {
      dispatch(
        doServerUpdate({
          online: false,
          software: "",
          url: error.config.url,
          version: ""
        })
      );
      fetchFailure(error);
    }
  },

  /**
   * Reads the current queryState and fills the missing information.
   * @param {ActionMapParams} param0
   * @param {string} param0.action.payload suggested default cube name
   */
  [CLIENT_HYDRATEQUERY]: ({action, client, dispatch, getState}) => {
    console.log("CLIENT_HYDRATEQUERY");
    const {fetchRequest, fetchSuccess, fetchFailure} = requestControl(dispatch, action);
    fetchRequest();

    const state = getState();
    const cubeMap = selectOlapCubeMap(state);
    const queries = selectQueryItems(state);

    const queryPromises = queries.map(queryItem => {
      const {params} = queryItem;

      // if params.cube is "" (default), use the suggested cube
      // if was set from permalink/state, check if valid, else use suggested
      const cubeName =
        params.cube && cubeMap[params.cube] ? params.cube : action.payload;

      return client.getCube(cubeName).then(cube => {
        const {measures: measureItems} = params;
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
            hydrateDrilldownProperties({cube, drilldownItem})
          )
          .filter(Boolean);
        const drilldowns = keyBy(resolvedDrilldowns, i => i.key);

        const cutPromises = Object.values(params.cuts).map(cutItem =>
          cutItem.membersLoaded
            ? cutItem
            : hydrateCutMembers({
              client,
              cube,
              cutItem,
              locale: params.locale
            })
        );
        return Promise.all(cutPromises).then(resolvedCuts => {
          const cuts = keyBy(resolvedCuts, i => i.key);

          return {
            ...queryItem,
            params: {
              ...queryItem.params,
              cube: cubeName,
              cuts,
              drilldowns,
              measures
            }
          };
        });
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
  [CLIENT_SETCUBE]: async({action, client, dispatch, getState}) => {
    console.log("CLIENT_SETCUBE");
    const state = getState();
    const currentMeasureMap = selectMeasureMap(state);

    /** @type {Record<string, MeasureItem>} */
    const measures = {};

    const cube = await client.getCube(action.payload);
    cube.measures.forEach((measure, index) => {
      const plainMeasure = measure.toJSON();
      const measureName = plainMeasure.name;
      measures[measureName] = buildMeasure({
        ...plainMeasure,
        active: !index,
        ...currentMeasureMap[measureName],
        uri: plainMeasure.uri
      });
    });

    dispatch(doCubeUpdate(cube.name, measures));
  },

  /**
   * Intercepts the order to update locale and dispatches the needed actions.
   * @param {ActionMapParams} param0
   * @param {string} param0.action.payload
   */
  [CLIENT_SETLOCALE]: async({action, client, dispatch, getState}) => {
    console.log("CLIENT_SETLOCALE");
    const state = getState();
    const currentLocale = selectLocaleCode(state);
    const nextLocale = action.payload;

    if (currentLocale !== nextLocale) {
      const currentCuts = selectCutItems(state);
      const unloadedCuts = currentCuts.map(cutItem => ({
        ...cutItem,
        membersLoaded: false
      }));
      const recordUnloadedCuts = keyBy(unloadedCuts, i => i.key);
      dispatch(doCutClear(recordUnloadedCuts));

      const cubeName = selectCubeName(state);
      const cube = await client.getCube(cubeName);
      const cutPromises = currentCuts.map(cutItem =>
        hydrateCutMembers({client, cube, cutItem, locale: nextLocale})
      );
      const loadedCuts = await Promise.all(cutPromises);
      const recordLoadedCuts = keyBy(loadedCuts, i => i.key);
      dispatch(doCutClear(recordLoadedCuts));

      dispatch(doLocaleUpdate(nextLocale));
      await dispatch({type: CLIENT_QUERY});
    }
  },

  /**
   * Takes a newly generated CutItem and fills its list of associated members.
   * Returns a copy of the CutItem with its members property filled.
   * @param {ActionMapParams} param0
   * @param {CutItem} param0.action.payload
   */
  [CLIENT_LOADMEMBERS]: async({action, client, dispatch, getState}) => {
    console.log("CLIENT_LOADMEMBERS");
    const state = getState();
    const cubeName = selectCubeName(state);
    const locale = selectLocaleCode(state);

    const cutItem = action.payload;

    const cube = await client.getCube(cubeName);
    const updatedCutItem = await hydrateCutMembers({
      client,
      cube,
      cutItem,
      locale
    });
    return dispatch(doCutUpdate(updatedCutItem));
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
    console.log("CLIENT_QUERY");
    const state = getState();
    const params = selectCurrentQueryParams(state);

    if (!isValidQuery(params)) return;

    const {fetchRequest, fetchSuccess, fetchFailure} = requestControl(dispatch, action);
    fetchRequest();

    try {
      const cube = await client.getCube(params.cube);
      const query = applyQueryParams(cube.query, params);

      const querydd = query.getParam("drilldowns").filter(Level.isLevel);
      const rowLevel =
        querydd.find(
          lvl => lvl.dimension.dimensionType === DimensionType.Time
        ) || querydd[0];
      const colLevel = querydd.find(lvl => lvl !== rowLevel);
      const queryms = query.getParam("measures");

      const rowLevelName = rowLevel.name;
      const colLevelName = colLevel?.name;
      const valMeasureName = queryms[0].name;
      const chartType = selectChartType(state);

      const aggregation = await client.execQuery(query, "logiclayer");
      dispatch(
        doCurrentResultUpdate({
          data: aggregation.data,
          error: null,
          chartConfig: buildChartConfig({
            levelNames: querydd.map(lvl => lvl.name),
            chartConfig: selectChartConfigText(state),
            configInterface: chartInterfaces[chartType],
            rowLevelName,
            valMeasureName
          }),
          pivotColumns: colLevelName,
          pivotRows: rowLevelName,
          pivotValues: valMeasureName,
          sourceCall: " " || query.toSource(),
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
  }
};

/** @type {import("redux").Middleware<{}, ExplorerState>} */
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
