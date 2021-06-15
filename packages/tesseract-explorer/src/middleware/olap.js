import {Client as OLAPClient, TesseractDataSource} from "@datawheel/olap-client";
import {requestControl} from "../state/loading/actions";
import {doCubeUpdate, doDrilldownUpdate, doLocaleUpdate} from "../state/params/actions";
import {selectCubeName, selectCurrentQueryParams, selectLocale, selectMeasureMap} from "../state/params/selectors";
import {doQueriesClear, doQueriesSelect, doQueriesUpdate} from "../state/queries/actions";
import {selectQueryItems} from "../state/queries/selectors";
import {doCurrentResultUpdate} from "../state/results/actions";
import {doServerUpdate} from "../state/server/actions";
import {selectOlapCubeMap, selectServerEndpoint} from "../state/server/selectors";
import {applyQueryParams, extractQueryParams} from "../utils/query";
import {buildDrilldown, buildMeasure, buildQuery} from "../utils/structs";
import {keyBy} from "../utils/transform";
import {isValidQuery} from "../utils/validation";
import {CLIENT_COUNTMEMBERS, CLIENT_DOWNLOAD, CLIENT_HYDRATEQUERY, CLIENT_LOADMEMBERS, CLIENT_PARSE, CLIENT_QUERY, CLIENT_SETCUBE, CLIENT_SETLOCALE, CLIENT_SETUP, doExecuteQuery, doPermalinkParse, doPermalinkUpdate} from "./actions";
import {fetchCutMembers, fetchMaxMemberCount, hydrateDrilldownProperties} from "./utils";

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
 */

const actionMap = {

  /**
   * Sets a new DataSource to the client instance, gets the server info, and
   * initializes the general state accordingly.
   * @param {TessExpl.OlapMiddleware.ActionMapParams<CLIENT_SETUP, OlapClient.ServerConfig>} param
   */
  [CLIENT_SETUP]: ({action, client, dispatch}) => {
    const {fetchRequest, fetchSuccess, fetchFailure} = requestControl(dispatch, action);
    fetchRequest();

    return OLAPClient.dataSourceFromURL(action.payload)
      .then(datasource => {
        client.setDataSource(datasource);
        return Promise.all([
          datasource.checkStatus(),
          client.getCubes()
        ]);
      })
      .then(result => {
        const [serverInfo, cubes] = result;
        const cubeMap = keyBy(cubes.map(c => c.toJSON()), i => i.name);

        dispatch(doServerUpdate({
          ...serverInfo,
          endpoint: serverInfo.software === TesseractDataSource.softwareName
            ? "logiclayer"
            : "aggregate",
          cubeMap
        }));
        fetchSuccess();

        return Promise.resolve()
          .then(() => dispatch(doPermalinkParse()))
          .then(() => dispatch({type: CLIENT_HYDRATEQUERY, payload: cubes[0].name}))
          .then(() => dispatch(doExecuteQuery()));
      }, error => {
        console.error("Server resolution error:", error);
        dispatch(
          doServerUpdate({
            online: false,
            software: "",
            url: error.config.url,
            version: ""
          })
        );
        fetchFailure(error);
      })
      .catch(error => {
        console.error("Unexpected error during startup", error);
        fetchFailure(error);
      });
  },

  /**
   * Reads the current queryState and fills the missing information.
   * Action Payload: suggested default cube name
   * @param {TessExpl.OlapMiddleware.ActionMapParams<CLIENT_HYDRATEQUERY, string>} param
   */
  [CLIENT_HYDRATEQUERY]: ({action, client, dispatch, getState}) => {
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
   * Action payload: cube name
   * @param {TessExpl.OlapMiddleware.ActionMapParams<CLIENT_SETCUBE, string>} param
   */
  [CLIENT_SETCUBE]: ({action, client, dispatch, getState}) => {
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
   * Action payload: ISO 639-2 locale code
   * @param {TessExpl.OlapMiddleware.ActionMapParams<CLIENT_SETLOCALE, string>} param
   */
  [CLIENT_SETLOCALE]: ({action, dispatch, getState}) => {
    const state = getState();
    const locale = selectLocale(state);

    return Promise.resolve(action.payload)
      .then(nextLocale => {
        if (locale.code === nextLocale) {
          return null;
        }
        dispatch(doLocaleUpdate(nextLocale));
        return dispatch(doExecuteQuery());
      });
  },

  /**
   *
   * @param {TessExpl.OlapMiddleware.ActionMapParams<CLIENT_COUNTMEMBERS, OlapClient.PlainLevel>} param
   * @returns
   */
  [CLIENT_COUNTMEMBERS]: ({action, client, dispatch, getState}) => {
    const state = getState();
    const cubeName = selectCubeName(state);

    const level = action.payload;
    const drilldownItem = buildDrilldown(level);
    dispatch(doDrilldownUpdate(drilldownItem));

    return client.getCube(cubeName).then(cube => {
      const dimension = cube.dimensionsByName[level.dimension];
      const hierarchy = dimension.hierarchiesByName[level.hierarchy];
      return client.datasource.fetchMembers(hierarchy.levelsByName[level.name])
        .then(members => {
          dispatch(doDrilldownUpdate({
            ...drilldownItem,
            dimType: dimension.dimensionType,
            memberCount: members.length
          }));
        });
    });
  },

  /**
   * Takes a newly generated CutItem and fills its list of associated members.
   * Returns a copy of the CutItem with its members property filled.
   * @param {TessExpl.OlapMiddleware.ActionMapParams<CLIENT_LOADMEMBERS, TessExpl.Struct.CutItem>} param
   */
  [CLIENT_LOADMEMBERS]: ({action, client, getState}) => {
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
   * Action payload: URL to parse
   * @param {TessExpl.OlapMiddleware.ActionMapParams<CLIENT_PARSE, string>} param
   */
  [CLIENT_PARSE]: ({action, client, dispatch}) => {
    const {fetchRequest, fetchSuccess, fetchFailure} = requestControl(dispatch, action);
    fetchRequest();

    return client.parseQueryURL(action.payload, {anyServer: true})
      .then(query => {
        const queryItem = buildQuery({
          params: extractQueryParams(query)
        });

        fetchSuccess();

        dispatch(doQueriesUpdate(queryItem));
        dispatch(doQueriesSelect(queryItem.key));
      })
      .then(null, fetchFailure)
      .then(() => dispatch({type: CLIENT_HYDRATEQUERY}));
  },

  /**
   * Executes the current queryState, and store the result in the State
   * @param {TessExpl.OlapMiddleware.ActionMapParams<CLIENT_QUERY, undefined>} param
   */
  [CLIENT_QUERY]: ({action, client, dispatch, getState}) => {
    const state = getState();
    const params = selectCurrentQueryParams(state);

    if (!isValidQuery(params)) return;

    const reqCtrl = requestControl(dispatch, action);
    reqCtrl.fetchRequest();

    client.getCube(params.cube)
      .then(cube => {
        const query = applyQueryParams(cube.query, params);
        const endpoint = selectServerEndpoint(state);
        return Promise.all([
          fetchMaxMemberCount(query).then(maxRows => {
            if (maxRows > 50000) {
              reqCtrl.fetchMessage({type: "HEAVY_QUERY", rows: maxRows});
            }
          }),
          client.execQuery(query, endpoint)
        ]);
      })
      .then(result => {
        const [, aggregation] = result;
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
        dispatch(doPermalinkUpdate());

        reqCtrl.fetchSuccess(aggregation);
      })
      .catch(error => {
        dispatch(doCurrentResultUpdate({error: error.message}));
        reqCtrl.fetchFailure(error);
      });
  },

  /**
   * Initiates a new download of the queried data by the current parameters.
   * Action payload: The format the user wants the data, from OlapClient options.
   * @param {TessExpl.OlapMiddleware.ActionMapParams<CLIENT_DOWNLOAD, OlapClient.Format>} param
   */
  [CLIENT_DOWNLOAD]: ({action, client, dispatch, getState}) => {
    const state = getState();
    const params = selectCurrentQueryParams(state);

    if (!isValidQuery(params)) {
      return Promise.reject(new Error("The current query is not valid."));
    }

    const reqCtrl = requestControl(dispatch, action);
    reqCtrl.fetchRequest();

    return client.getCube(params.cube)
      .then(cube => {
        const format = action.payload;
        const filename = `${cube.name}_${new Date().toISOString()}`;
        const query = applyQueryParams(cube.query, params);
        query.setFormat(format);

        const url = query.toString("logiclayer");
        return Promise.all([
          fetchMaxMemberCount(query).then(maxRows => {
            if (maxRows > 50000) {
              reqCtrl.fetchMessage({type: "HEAVY_QUERY", rows: maxRows});
            }
          }),
          fetch(url).then(response => response.text())
        ]).then(result => {
          reqCtrl.fetchSuccess(filename);
          return {
            content: result[1],
            extension: format.replace(/json\w+/, "json"),
            name: filename
          };
        });
      })
      .catch(error => {
        dispatch(doCurrentResultUpdate({error: error.message}));
        reqCtrl.fetchFailure(error);
      });
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
