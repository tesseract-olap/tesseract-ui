import {Client as TesseractClient} from "@datawheel/tesseract-client";
import {
  CUBE_FETCH_FAILURE,
  CUBE_FETCH_REQUEST,
  CUBE_FETCH_SUCCESS,
  CUBE_SELECT
} from "../actions/cubes";
import {DATASET_FAILURE, DATASET_REQUEST, DATASET_SUCCESS} from "../actions/dataset";
import {QUERY_CUTS_ADD, QUERY_CUTS_UPDATE} from "../actions/query";
import {UI_SERVER_INFO} from "../actions/ui";
import {
  isActiveCut,
  isActiveItem,
  validGrowthState,
  validRcaState,
  validTopState
} from "./validation";

/** @typedef {import("@datawheel/tesseract-client").Query} Query */

/** @type {TesseractClient} */
let client;

export function initializeClient(dispatch, src) {
  client = new TesseractClient(src);
  return client.checkStatus().then(info => {
    dispatch({type: UI_SERVER_INFO, payload: info});
    dispatch({type: CUBE_FETCH_REQUEST});
    return client.cubes().then(
      payload => {
        dispatch({type: CUBE_FETCH_SUCCESS, payload});
        dispatch({type: CUBE_SELECT, payload: payload[0]});
      },
      err => dispatch({type: CUBE_FETCH_FAILURE, payload: err})
    );
  });
}

export function fetchMembers(dispatch, basePayload) {
  return client.members(basePayload.drillable).then(
    allMembers => {
      allMembers.sort((a, b) => `${a.key}`.localeCompare(`${b.key}`));
      const payload = {...basePayload, allMembers, active: true};
      dispatch({type: QUERY_CUTS_UPDATE, payload});
    },
    error => {
      const payload = {...basePayload, error};
      dispatch({type: QUERY_CUTS_UPDATE, payload});
    }
  );
}

export function addCutAndFetchMembers(dispatch, basePayload) {
  const payload = {...basePayload, loading: true};
  dispatch({type: QUERY_CUTS_ADD, payload});
  return fetchMembers(dispatch, basePayload);
}

/** @param {Query} query */
export function executeQuery(dispatch, query) {
  dispatch({type: DATASET_REQUEST, payload: query});
  return client
    .execQuery(query)
    .then(
      aggregation => dispatch({type: DATASET_SUCCESS, payload: aggregation}),
      error => dispatch({type: DATASET_FAILURE, payload: error})
    );
}

/**
 * @param {Query} query
 * @param {import("../reducers/queryReducer").QueryState} params
 */
export function applyQueryParams(query, params) {
  params.drilldowns.forEach(item => {
    isActiveItem(item) && query.addDrilldown(item.drillable);
  });
  params.measures.forEach(item => {
    isActiveItem(item) && query.addMeasure(item.measure);
  });
  params.cuts.forEach(item => {
    isActiveCut(item) && query.addCut(item.drillable, item.members);
  });

  const {growth, rca, top} = params;
  if (validGrowthState(growth)) {
    query.setGrowth(growth.level, growth.measure);
  }
  if (validRcaState(rca)) {
    query.setRCA(rca.level1, rca.level2, rca.measure);
  }
  if (validTopState(top)) {
    query.setTop(top.amount, top.level, top.measure, top.order);
  }

  query.setOption("parents", params.parents);

  return query;
}
