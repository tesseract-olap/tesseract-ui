export const QUERY_CUBE_UPDATE       = "explorer/QUERY/CUBE/UPDATE";
export const QUERY_CUTS_CLEAR        = "explorer/QUERY/CUTS/CLEAR";
export const QUERY_CUTS_CREATE       = "explorer/QUERY/CUTS/CREATE";
export const QUERY_CUTS_REMOVE       = "explorer/QUERY/CUTS/REMOVE";
export const QUERY_CUTS_REPLACE      = "explorer/QUERY/CUTS/REPLACE";
export const QUERY_CUTS_UPDATE       = "explorer/QUERY/CUTS/UPDATE";
export const QUERY_DEBUG_TOGGLE      = "explorer/QUERY/DEBUG/TOGGLE";
export const QUERY_DISTINCT_TOGGLE   = "explorer/QUERY/DISTINCT/TOGGLE";
export const QUERY_DRILLDOWNS_CLEAR  = "explorer/QUERY/DRILLDOWNS/CLEAR";
export const QUERY_DRILLDOWNS_CREATE = "explorer/QUERY/DRILLDOWNS/CREATE";
export const QUERY_DRILLDOWNS_REMOVE = "explorer/QUERY/DRILLDOWNS/REMOVE";
export const QUERY_DRILLDOWNS_UPDATE = "explorer/QUERY/DRILLDOWNS/UPDATE";
export const QUERY_FILTERS_CLEAR     = "explorer/QUERY/FILTERS/CLEAR";
export const QUERY_FILTERS_CREATE    = "explorer/QUERY/FILTERS/CREATE";
export const QUERY_FILTERS_REMOVE    = "explorer/QUERY/FILTERS/REMOVE";
export const QUERY_GROWTH_CLEAR      = "explorer/QUERY/GROWTH/CLEAR";
export const QUERY_GROWTH_UPDATE     = "explorer/QUERY/GROWTH/UPDATE";
export const QUERY_INYECT            = "explorer/QUERY/INYECT";
export const QUERY_MEASURES_TOGGLE   = "explorer/QUERY/MEASURES/TOGGLE";
export const QUERY_NONEMPTY_TOGGLE   = "explorer/QUERY/NONEMPTY/TOGGLE";
export const QUERY_PARENTS_TOGGLE    = "explorer/QUERY/PARENTS/TOGGLE";
export const QUERY_RCA_CLEAR         = "explorer/QUERY/RCA/CLEAR";
export const QUERY_RCA_UPDATE        = "explorer/QUERY/RCA/UPDATE";
export const QUERY_SPARSE_TOGGLE     = "explorer/QUERY/SPARSE/TOGGLE";
export const QUERY_TOPK_CLEAR        = "explorer/QUERY/TOPK/CLEAR";
export const QUERY_TOPK_UPDATE       = "explorer/QUERY/TOPK/UPDATE";

export const queryInyect = queryState => ({type: QUERY_INYECT, payload: queryState});

export const queryCubeSet = (cubeName, measureItems) => ({
  type: QUERY_CUBE_UPDATE,
  payload: {cube: cubeName, measures: measureItems}
});

export const queryCutAdd = item => ({type: QUERY_CUTS_CREATE, payload: item});
export const queryCutUpdate = item => ({type: QUERY_CUTS_UPDATE, payload: item});
export const queryCutRemove = item => ({type: QUERY_CUTS_REMOVE, payload: item});
export const queryCutReplace = cuts => ({type: QUERY_CUTS_REPLACE, payload: cuts});

export const queryDrilldownAdd = item => ({type: QUERY_DRILLDOWNS_CREATE, payload: item});
export const queryDrilldownRemove = item => ({
  type: QUERY_DRILLDOWNS_REMOVE,
  payload: item
});
export const queryDrilldownUpdate = item => ({
  type: QUERY_DRILLDOWNS_UPDATE,
  payload: item
});

export const queryMeasureToggle = item => ({type: QUERY_MEASURES_TOGGLE, payload: item});

export const queryGrowthClear = () => ({type: QUERY_GROWTH_CLEAR});
export const queryGrowthUpdate = payload => ({type: QUERY_GROWTH_UPDATE, payload});

export const queryRcaClear = () => ({type: QUERY_RCA_CLEAR});
export const queryRcaUpdate = payload => ({type: QUERY_RCA_UPDATE, payload});

export const queryTopkClear = () => ({type: QUERY_TOPK_CLEAR});
export const queryTopkUpdate = payload => ({type: QUERY_TOPK_UPDATE, payload});

export const queryDebugToggle = () => ({type: QUERY_DEBUG_TOGGLE});
export const queryDistinctToggle = () => ({type: QUERY_DISTINCT_TOGGLE});
export const queryNonEmptyToggle = () => ({type: QUERY_NONEMPTY_TOGGLE});
export const queryParentsToggle = () => ({type: QUERY_PARENTS_TOGGLE});
export const querySparseToggle = () => ({type: QUERY_SPARSE_TOGGLE});
