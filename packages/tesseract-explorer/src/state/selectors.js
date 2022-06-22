import {createSelector} from "reselect";
import {triad, tuple} from "../utils/array";
import {selectCubeName} from "./params/selectors";
import {selectOlapCubeMap} from "./server/selectors";
import {getOrderValue} from "./helpers";

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
 * @returns {Record<string, OlapClient.PlainMeasure>}
 */
export const selectOlapMeasureMap = createSelector(
  selectOlapCube,
  cube => Object.fromEntries(cube.measures.map(item => [item.name, item]))
);

/**
 * @returns {OlapClient.PlainDimension[]}
 */
export const selectOlapDimensionItems = createSelector(
  selectOlapCube,
  cube => cube
    ? cube.dimensions
      .map(dim => ({
        item: {
          ...dim,
          hierarchies: dim.hierarchies.map(hierarchy => {
            hierarchy.levels.sort((a, b) =>
              getOrderValue(a) - getOrderValue(b)
            );
            return hierarchy;
          })
            .sort((a, b) =>
              getOrderValue(a) - getOrderValue(b)
            )
        },
        count: dim.hierarchies.reduce((acc, hie) => acc + hie.levels.length, 0),
        alpha: dim.hierarchies.reduce((acc, hie) => acc.concat(hie.name, "-"), "")
      })
      )
      .sort((a, b) =>
        getOrderValue(a.item) - getOrderValue(b.item) ||
        b.count - a.count ||
        a.alpha.localeCompare(b.alpha)
      )
      .map(i => i.item)
    : []
);

/**
 * @returns {Record<string, [OlapClient.PlainDimension, OlapClient.PlainHierarchy, OlapClient.PlainLevel]>}
 */
export const selectLevelTriadMap = createSelector(
  selectOlapCube,
  cube => Object.fromEntries(
    cube.dimensions.flatMap(dim =>
      dim.hierarchies.flatMap(hie =>
        hie.levels.map(lvl => {
          const fullName = [dim.name, hie.name, lvl.name].join(".");
          return tuple(fullName, triad(dim, hie, lvl));
        })
      )
    )
  )
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
