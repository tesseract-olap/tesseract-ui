import {Client as OLAPClient, TesseractDataSource} from "@datawheel/olap-client";
import {updateAggregation} from "../actions/aggregation";
import {
  CLIENT_HYDRATEQUERY,
  CLIENT_LOADMEMBERS,
  CLIENT_QUERY,
  CLIENT_SETCUBE,
  CLIENT_SETLOCALE,
  CLIENT_SETUP
} from "../actions/client";
import {cubesUpdate} from "../actions/cubes";
import {updatePermalink} from "../actions/permalink";
import {
  queryCubeSet,
  queryCutReplace,
  queryCutUpdate,
  queryLocaleUpdate
} from "../actions/query";
import {setServerInfo} from "../actions/ui";
import {ensureArray, sortByKey} from "../utils/array";
import {buildJavascriptCall} from "../utils/debug";
import {applyQueryParams, buildCut, buildMeasure, buildMember} from "../utils/query";
import {isActiveItem, isValidQuery} from "../utils/validation";

/**
 * @typedef ActionMapParams
 * @property {import("redux").AnyAction} action
 * @property {OLAPClient} client
 * @property {import("redux").Dispatch} dispatch
 * @property {() => import("../reducers").ExplorerState} getState
 * @property {import("redux").Dispatch} next
 */

const actionMap = {
  /**
   * Sets a new DataSource to the client instance, gets the server info, and
   * initializes the general state accordingly.
   * @param {ActionMapParams} param0
   * @param {string} param0.action.payload The URL for the server to use
   */
  [CLIENT_SETUP]: async ({action, client, dispatch}) => {
    const {fetchRequest, fetchSuccess, fetchFailure} = requestControl(dispatch, action);
    fetchRequest();

    let cube;

    try {
      const datasource = await OLAPClient.dataSourceFromURL(action.payload);
      client.setDataSource(datasource);

      const info = await client.checkStatus();
      dispatch(setServerInfo(info));

      const cubes = await client.getCubes();
      const cubeMap = {};
      let n = cubes.length;
      while (n--) {
        cube = cubes[n];
        cubeMap[cube.name] = cube.toJSON();
      }
      dispatch(cubesUpdate(cubeMap));

      fetchSuccess();
    } catch (error) {
      dispatch(
        setServerInfo({
          online: false,
          software: "",
          url: error.config.url,
          version: ""
        })
      );
      fetchFailure(error);
    }

    await dispatch({type: CLIENT_HYDRATEQUERY, payload: cube && cube.name});
    await dispatch({type: CLIENT_QUERY});
  },

  /**
   * Changes the current cube and updates related state
   * @param {ActionMapParams} param0
   * @param {string} param0.action.payload
   */
  [CLIENT_SETCUBE]: async ({action, client, dispatch, getState}) => {
    const {measures: queryStateMeasures} = getState().explorerQuery;
    const cube = await client.getCube(action.payload);
    const measures = cube.measures.map((measure, index) => {
      const measureName = measure.name;
      const partialItem = queryStateMeasures.find(i => i.measure === measureName);
      return buildMeasure({...measure.toJSON(), active: !index, ...partialItem});
    });
    dispatch(queryCubeSet(cube.name, measures));
  },

  /**
   * Reads the current queryState and fills the missing information.
   * @param {ActionMapParams} param0
   * @param {string} param0.action.payload
   */
  [CLIENT_HYDRATEQUERY]: async ({action, client, dispatch, getState}) => {
    const {fetchRequest, fetchSuccess, fetchFailure} = requestControl(dispatch, action);
    fetchRequest();

    const {explorerQuery: queryState, explorerCubes: cubesList} = getState();
    const cubeName = queryState.cube in cubesList ? queryState.cube : action.payload;

    try {
      const cube = await client.getCube(cubeName);
      const cuts = queryState.cuts.map(
        cutItem =>
          cutItem.membersLoaded
            ? cutItem
            : updateCutMembers({client, cube, cutItem, locale: queryState.locale})
      );
      await dispatch({type: CLIENT_SETCUBE, payload: cubeName});

      const updatedCuts = await Promise.all(cuts);
      dispatch(queryCutReplace(updatedCuts));

      fetchSuccess();
    } catch (error) {
      fetchFailure(error);
    }
  },

  /**
   * Intercepts the order to update locale and dispatches the needed actions.
   * @param {ActionMapParams} param0
   * @param {string} param0.action.payload
   */
  [CLIENT_SETLOCALE]: async ({action, client, dispatch, getState}) => {
    const {cube: cubeName, cuts, locale: prevLocale} = getState().explorerQuery;
    const nextLocale = action.payload;
    if (prevLocale !== nextLocale) {
      const unloadedCuts = cuts.map(cutItem => ({...cutItem, membersLoaded: false}));
      dispatch(queryCutReplace(unloadedCuts));

      const cube = await client.getCube(cubeName);
      const cutPromises = cuts.map(cutItem =>
        updateCutMembers({client, cube, cutItem, locale: nextLocale})
      );
      const updatedCuts = await Promise.all(cutPromises);
      dispatch(queryCutReplace(updatedCuts));

      dispatch(queryLocaleUpdate(nextLocale));
      await dispatch({type: CLIENT_QUERY});
    }
  },

  /**
   * Takes a newly generated CutItem and fills its list of associated members.
   * Returns a copy of the CutItem with its members property filled.
   * @param {ActionMapParams} param0
   * @param {import("../reducers").CutItem} param0.action.payload
   */
  [CLIENT_LOADMEMBERS]: async ({action, client, dispatch, getState}) => {
    const {cube: cubeName, locale} = getState().explorerQuery;
    const cutItem = action.payload;
    const cube = await client.getCube(cubeName);
    const updatedCutItem = await updateCutMembers({client, cube, cutItem, locale});
    return dispatch(queryCutUpdate(updatedCutItem));
  },

  /**
   * Executes the current queryState, and store the result in the State
   * @param {ActionMapParams} param0
   */
  [CLIENT_QUERY]: async ({action, client, dispatch, getState}) => {
    const {explorerQuery: queryState, explorerUi: uiState} = getState();
    if (!isValidQuery(queryState)) {
      return;
    }

    const {fetchRequest, fetchSuccess, fetchFailure} = requestControl(dispatch, action);
    fetchRequest();

    try {
      const cube = await client.getCube(queryState.cube);
      const query = applyQueryParams(cube.query, queryState);

      const llUrl =
        uiState.serverSoftware === TesseractDataSource.softwareName
          ? TesseractDataSource.urlLogicLayer(query)
          : "";
      const jsCall = buildJavascriptCall(queryState);

      const aggregation = await client.execQuery(query);
      dispatch(updateAggregation(aggregation, {jsCall, llUrl}));
      dispatch(updatePermalink());

      fetchSuccess(aggregation);
    } catch (error) {
      fetchFailure(error);
    }
  }
};

/**
 * Updates the list of members of a CutItem
 * @param {object} p
 * @param {OLAPClient} p.client
 * @param {import("@datawheel/olap-client").Cube} p.cube
 * @param {import("../reducers").CutItem} p.cutItem
 * @param {string|undefined} p.locale
 */
async function updateCutMembers({client, cube, cutItem, locale}) {
  const partialMembers = ensureArray(cutItem.members)
    .filter(isActiveItem)
    .map(member => `${member.key}`);
  const {level: levelName, hierarchy, dimension} = cutItem;

  try {
    for (let level of cube.levelIterator) {
      if (level.name === levelName) {
        const sameHie = hierarchy ? hierarchy === level.hierarchy.name : true;
        const sameDim = dimension ? dimension === level.dimension.name : true;
        if (sameDim && sameHie) {
          const rawMembers = await client.getMembers(level, {locale});
          const members = rawMembers.map(member => {
            const active = partialMembers.includes(`${member.key}`);
            return buildMember({name: member.caption, key: member.key, active});
          });
          return buildCut({
            ...cutItem,
            active: true,
            members: sortByKey(members, "key", false),
            membersLoaded: true
          });
        }
      }
    }
    throw new Error(
      `Couldn't find level from reference: {"dimension":"${dimension}", "hierarchy":"${hierarchy}", "level":"${levelName}"}`
    );
  } catch (error) {
    return buildCut({
      ...cutItem,
      error: error.message,
      membersLoaded: false
    });
  }
}

/**
 * Provides a quick API to dispatch actions that control the loading state of the UI.
 * @param {import("redux").Dispatch} dispatch
 * @param {import("redux").AnyAction} param1
 */
function requestControl(dispatch, {type: trigger, ...action}) {
  return {
    fetchRequest: payload =>
      dispatch({type: `${trigger}/FETCH:REQUEST`, action, payload}),
    fetchSuccess: payload =>
      dispatch({type: `${trigger}/FETCH:SUCCESS`, action, payload}),
    fetchFailure: error =>
      dispatch({type: `${trigger}/FETCH:FAILURE`, action, payload: error.message})
  };
}

/** @type {import("redux").Middleware<{}, import("../reducers").ExplorerState>} */
function olapClientMiddleware({dispatch, getState}) {
  const client = new OLAPClient();

  return next => action => {
    return action.type in actionMap
      ? actionMap[action.type]({action, client, dispatch, getState, next})
      : next(action);
  };
}

export default olapClientMiddleware;
