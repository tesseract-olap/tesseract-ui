import {CUBE_SELECT} from "../../actions/cubes";
import {
  QUERY_GROWTH_UPDATE,
  QUERY_MEASURES_CLEAR,
  QUERY_MEASURES_UPDATE,
  QUERY_PARENTS_TOGGLE,
  QUERY_RCA_UPDATE,
  QUERY_TOP_UPDATE
} from "../../actions/query";
import cutsReducer from "./cutsReducer";
import drilldownsReducer from "./drilldownsReducer";
import filtersReducer from "./filtersReducer";

const initialState = {
  cuts: [],
  drilldowns: [],
  filters: [],
  growth: {},
  measures: [],
  parents: false,
  rca: {},
  top: {}
};

function queryReducer(state = initialState, action) {
  state = cutsReducer(state, action);
  state = drilldownsReducer(state, action);
  state = filtersReducer(state, action);

  switch (action.type) {
    case CUBE_SELECT: {
      const cube = action.payload;
      const measures = cube.measures.map((measure, i) => ({
        key: measure.name,
        measure,
        active: !i
      }));
      return {...initialState, measures};
    }

    case QUERY_GROWTH_UPDATE: {
      const drilldowns = state.drilldowns.slice();
      const growth = action.payload;
      const drillable = growth.level;
      if (drilldowns.every(item => item.drillable !== drillable)) {
        drilldowns.push({key: drillable.fullName, drillable, active: true});
      }
      return {...state, drilldowns, growth};
    }

    case QUERY_MEASURES_UPDATE: {
      const name = action.payload.key;
      return {
        ...state,
        measures: state.measures.map(item => (item.key === name ? action.payload : item))
      };
    }

    case QUERY_MEASURES_CLEAR: {
      return {...state, measures: []};
    }

    case QUERY_PARENTS_TOGGLE: {
      return {...state, parents: !state.parents};
    }

    case QUERY_RCA_UPDATE: {
      const rca = action.payload;
      return {...state, rca};
    }

    case QUERY_TOP_UPDATE: {
      const top = action.payload;
      return {...state, top};
    }

    default:
      return state;
  }
}

export default queryReducer;
