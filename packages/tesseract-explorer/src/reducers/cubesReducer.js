import {CUBES_UPDATE} from "../actions/cubes";

/**
 * @typedef {Object<string, JSONCube>} CubesState
 * @property {string[]} _all
 * @property {boolean} _loaded
 */

/**
 * @typedef JSONCube
 * @property {any} annotations
 * @property {JSONDimension[]} dimensions
 * @property {JSONMeasure[]} measures
 * @property {string} name
 */

/**
 * @typedef JSONMeasure
 * @property {any} aggregator
 * @property {any} annotations
 * @property {string} name
 */

/**
 * @typedef JSONDimension
 * @property {any} annotations
 * @property {string} type
 * @property {JSONHierarchy[]} hierarchies
 * @property {string} fullName
 * @property {string} name
 */

/**
 * @typedef JSONHierarchy
 * @property {any} annotations
 * @property {JSONLevel[]} levels
 * @property {string} fullName
 * @property {string} name
 */

/**
 * @typedef JSONLevel
 * @property {any} annotations
 * @property {any} properties
 * @property {string} fullName
 * @property {string} name
 */

/** @type {CubesState} */
const initialState = {
  _all: [],
  _loaded: false
};

/** @type {import("redux").Reducer<CubesState>} */
function cubesReducer(state = initialState, action) {
  switch (action.type) {
    case CUBES_UPDATE:
      return {...action.payload, _all: Object.keys(action.payload), _loaded: true};

    default:
      return state;
  }
}

export default cubesReducer;
