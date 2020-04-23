import {createSelector} from "reselect";
import {selectCubesState, selectQueryState} from "./state";

export const selectCubeNameList = createSelector(selectCubesState, cubes =>
  Object.keys(cubes)
);

export const selectCubeList = createSelector(selectCubesState, cubes =>
  Object.values(cubes)
);

export const selectCurrentCube = createSelector(
  [selectCubesState, selectQueryState],
  (cubes, {cube}) => cube in cubes ? cubes[cube] : undefined
);

export const selectMeasureNameList = createSelector(
  selectCurrentCube,
  cube => cube && cube.measures.map(m => m.name)
);

export const selectDimensionList = createSelector(
  selectCurrentCube,
  cube => cube && cube.dimensions
);

export const selectTimeDimension = createSelector(
  selectCurrentCube,
  cube =>
    cube &&
    cube.dimensions.find(
      d => d.dimensionType === "time" || d.name === "Year" || d.name === "Date"
    )
);
