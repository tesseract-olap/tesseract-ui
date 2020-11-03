import {createSelector} from "reselect";
import {keyBy} from "../utils/transform";
import {selectCubeName, selectMeasureMap, selectDrilldownItems} from "./params/selectors";
import {selectOlapCubeMap} from "./server/selectors";
import {getKeys, getValues} from "./helpers";

/**
 * @returns {OlapCube}
 */
export const selectOlapCube = createSelector(
  [selectOlapCubeMap, selectCubeName],
  (cubeMap, cubeName) => cubeMap[cubeName]
);

/**
 * @returns {OlapMeasure[]}
 */
export const selectOlapMeasureItems = createSelector(
  selectOlapCube,
  cube => cube ? cube.measures : []
);

/**
 * @returns {OlapMeasure[]}
 */
export const selectOlapMeasureItemsFromParams = createSelector(
  [selectMeasureMap, selectOlapMeasureItems],
  (measureMap, measures) => measures.filter(measure => measureMap[measure.name].active)
);

/**
 * @returns {OlapDimension[]}
 */
export const selectOlapDimensionItems = createSelector(
  selectOlapCube,
  cube => cube ? cube.dimensions : []
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
      keyBy(hierarchy.levels, d => d.name, levelMap)
    )
  );
  return levelMap;
});
export const selectOlapLevelKeys = createSelector(selectOlapLevelMap, getKeys);
export const selectOlapLevelItems = createSelector(selectOlapLevelMap, getValues);

export const selectOlapLevelItemsFromParams = createSelector(
  [selectDrilldownItems, selectOlapLevelItems],
  (drilldownItems, levels) => {
    const drilldownMap = keyBy(drilldownItems, d => d.level);
    return levels.filter(level => drilldownMap[level.name]?.active);
  }
);
