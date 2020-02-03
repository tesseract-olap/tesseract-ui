import {createSelector} from "reselect";
import {keyBy} from "../utils/transform";
import {selectCurrentQueryParams} from "./params/selectors";
import {selectOlapCubeMap} from "./server/selectors";

/**
 * @returns {OlapCube}
 */
export const selectOlapCube = createSelector(
  [selectOlapCubeMap, selectCurrentQueryParams],
  (cubeMap, params) => cubeMap[params.cube]
);

/**
 * @returns {OlapMeasure[]}
 */
export const selectOlapMeasureItems = createSelector(
  selectOlapCube,
  cube => (cube ? cube.measures : [])
);

/**
 * @returns {OlapDimension[]}
 */
export const selectOlapDimensionItems = createSelector(
  selectOlapCube,
  cube => (cube ? cube.dimensions : [])
);

/**
 * @returns {OlapDimension | undefined}
 */
export const selectOlapTimeDimension = createSelector(
  selectOlapDimensionItems,
  dimensions =>
    dimensions.find(
      d => d.dimensionType === "time" || d.name === "Year" || d.name === "Date"
    )
);

export const selectOlapLevelMap = createSelector(selectOlapDimensionItems, dimensions => {
  /** @type {Record<string, OlapLevel>} */
  const levelMap = {};
  dimensions.forEach(dimension =>
    dimension.hierarchies.forEach(hierarchy =>
      keyBy(hierarchy.levels, "uniqueName", levelMap)
    )
  );
  return levelMap;
});

export const selectOlapLevelKeys = createSelector(selectOlapLevelMap, levelMap =>
  Object.keys(levelMap)
);

export const selectOlapLevelItems = createSelector(selectOlapLevelMap, levelMap =>
  Object.values(levelMap)
);
