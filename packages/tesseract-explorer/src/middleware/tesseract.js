import {Client as TesseractClient} from "@datawheel/tesseract-client";
import {updateAggregation} from "../actions/aggregation";
import {
  CLIENT_CHECKSERVER,
  CLIENT_FETCH_FAILURE,
  CLIENT_FETCH_REQUEST,
  CLIENT_FETCH_SUCCESS,
  CLIENT_HYDRATEQUERY,
  CLIENT_INITIALLOAD,
  CLIENT_LOADMEMBERS,
  CLIENT_QUERY,
  CLIENT_SETCUBE,
  CLIENT_SETUP
} from "../actions/client";
import {cubesUpdate} from "../actions/cubes";
import {queryCubeSet, queryCutReplace, queryCutUpdate} from "../actions/query";
import {uiServerInfo} from "../actions/ui";
import {buildJavascriptCall} from "../utils/debug";
import {serializePermalink} from "../utils/format";
import {applyQueryParams, buildCut, buildMeasure, buildMember} from "../utils/query";

/** @type {import("redux").Middleware<{}, import("../reducers").ExplorerState>} */
function tesseractClientMiddleware({dispatch, getState}) {
  /** @type {TesseractClient} */
  let client;

  return next => {
    return action => {
      switch (action.type) {
        case CLIENT_SETUP: {
          client = new TesseractClient(action.src);
          return dispatch({type: CLIENT_CHECKSERVER});
        }

        case CLIENT_CHECKSERVER: {
          dispatch({type: CLIENT_FETCH_REQUEST, action});
          return client.checkStatus().then(
            info => {
              info.version = `tesseract-olap v${info.version}`;
              dispatch({type: CLIENT_FETCH_SUCCESS, action, payload: info});
              dispatch(uiServerInfo(info));
              return dispatch({type: CLIENT_INITIALLOAD});
            },
            error =>
              dispatch({type: CLIENT_FETCH_FAILURE, action, payload: error.message})
          );
        }

        case CLIENT_INITIALLOAD: {
          dispatch({type: CLIENT_FETCH_REQUEST, action});

          return client
            .cubes()
            .then(cubes => {
              const cubeMap = {};
              cubes.forEach(cube => {
                cubeMap[cube.name] = JSON.parse(JSON.stringify(cube));
              });
              dispatch(cubesUpdate(cubeMap));

              const {explorerQuery} = getState();
              const cubeName = explorerQuery.cube || cubes[0].name;
              return dispatch({type: CLIENT_HYDRATEQUERY, payload: cubeName});
            })
            .then(_ => dispatch({type: CLIENT_QUERY}))
            .then(
              _ => dispatch({type: CLIENT_FETCH_SUCCESS, action}),
              err => dispatch({type: CLIENT_FETCH_FAILURE, action, payload: err.message})
            );
        }

        case CLIENT_SETCUBE: {
          const cubeName = action.payload;
          return client.cube(cubeName).then(cube => {
            const measures = cube.measures.map((item, i) =>
              buildMeasure(item, {active: !i})
            );
            return dispatch(queryCubeSet(cube.name, measures));
          });
        }

        case CLIENT_HYDRATEQUERY: {
          const currentQuery = getState().explorerQuery;
          const cubeName = action.payload || currentQuery.cube;
          return client.cube(cubeName).then(cube => {
            const cuts = currentQuery.cuts.map(item => {
              return !item.membersLoaded ? fetchMembers(cubeName, item) : item;
            });

            const measures = cube.measures.map(measure => {
              const measureName = measure.name;
              const partialItem = currentQuery.measures.find(
                item => item.measure === measureName
              );
              return buildMeasure(measure, partialItem);
            });
            dispatch(queryCubeSet(cubeName, measures));

            return Promise.all(cuts).then(cuts => dispatch(queryCutReplace(cuts)));
          });
        }

        case CLIENT_LOADMEMBERS: {
          /** @type {import("../reducers").CutItem} */
          const item = action.payload;
          const currentQuery = getState().explorerQuery;
          return fetchMembers(currentQuery.cube, item).then(cutItem =>
            dispatch(queryCutUpdate(cutItem))
          );
        }

        case CLIENT_QUERY: {
          dispatch({type: CLIENT_FETCH_REQUEST, action});

          const currentQuery = getState().explorerQuery;
          return client
            .cube(currentQuery.cube)
            .then(cube => {
              const query = cube.query;
              applyQueryParams(query, currentQuery);
              const permalink = serializePermalink(currentQuery);
              const llUrl = query.getLogicLayerUrl();
              const jsCall = buildJavascriptCall(currentQuery);

              return client.execQuery(query).then(aggregation => {
                dispatch(updateAggregation(aggregation, {jsCall, llUrl, permalink}));
              });
            })
            .then(
              () => {
                dispatch({type: CLIENT_FETCH_SUCCESS, action});
              },
              error =>
                dispatch({type: CLIENT_FETCH_FAILURE, action, payload: error.message})
            );
        }

        default:
          return next(action);
      }
    };
  };

  /** @param {import("../reducers").CutItem} cutItem */
  function fetchMembers(cubeName, cutItem) {
    const partialMembers = cutItem.members || [];
    return client
      .cube(cubeName)
      .then(cube => {
        const level = cube.queryFullName(cutItem.drillable);
        // @ts-ignore
        return client.members(level);
      })
      .then(
        members =>
          buildCut(cutItem, {
            active: true,
            members: members
              .map(member =>
                buildMember(member, {
                  active: partialMembers.some(m => m.key == member.key)
                })
              )
              .sort(
                members.length > 0 && isFinite(members[0].key) && !isNaN(members[0].key)
                  ? (a, b) => a.key - b.key
                  : (a, b) => `${a.key}`.localeCompare(`${b.key}`)
              ),
            membersLoaded: true
          }),
        error =>
          buildCut(cutItem, {
            error: error.message,
            membersLoaded: false
          })
      );
  }
}

export default tesseractClientMiddleware;
