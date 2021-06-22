import {createSelector} from "reselect";
import {selectCubeName} from "./params/selectors";
import {selectOlapCubeMap} from "./server/selectors";

/**
 * @returns {OlapClient.PlainCube}
 */
export const selectOlapCube = createSelector(
  [selectOlapCubeMap, selectCubeName],
  (cubeMap, cubeName) => cubeMap[cubeName]
);

/**
 * @returns {OlapClient.PlainMeasure[]}
 */
export const selectOlapMeasureItems = createSelector(
  selectOlapCube,
  cube => cube ? cube.measures : []
);

/**
 * @returns {OlapClient.PlainDimension[]}
 */
export const selectOlapDimensionItems = createSelector(
  selectOlapCube,
  cube => cube ? cube.dimensions : []
);

/**
 * @returns {OlapClient.PlainDimension | undefined}
 */
export const selectOlapTimeDimension = createSelector(
  selectOlapDimensionItems,
  dimensions =>
    dimensions.find(
      d => d.dimensionType === "time" || d.name === "Year" || d.name === "Date"
    )
);
