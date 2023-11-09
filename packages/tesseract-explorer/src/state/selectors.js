import {createSelector} from "@reduxjs/toolkit";
import {triad, tuple} from "../utils/array";
import {getOrderValue} from "../utils/object";
import {selectCubeName, selectCurrentQueryParams} from "./queries";
import {selectOlapCubeMap} from "./server";
import {serializePermalink} from "../utils/permalink";


export const selectOlapCube = createSelector(
  [selectOlapCubeMap, selectCubeName],
  (cubeMap, cubeName) => cubeName in cubeMap ? cubeMap[cubeName] : undefined
);

export const selectOlapMeasureItems = createSelector(
  selectOlapCube,
  cube => cube ? cube.measures : []
);

export const selectOlapMeasureMap = createSelector(
  selectOlapMeasureItems,
  measures => Object.fromEntries(measures.map(item => [item.name, item]))
);

/** @type {(state: import("./store").ExplorerState) => import("@datawheel/olap-client").PlainDimension[]} */
export const selectOlapDimensionItems = createSelector(
  selectOlapCube,
  cube => !cube
    ? []
    : cube.dimensions
      .map(dim => ({
        item: {
          ...dim,
          hierarchies: dim.hierarchies
            .slice()
            .map(hierarchy => {
              hierarchy.levels
                .slice()
                .sort((a, b) =>
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
      }))
      .sort((a, b) =>
        getOrderValue(a.item) - getOrderValue(b.item) ||
        b.count - a.count ||
        a.alpha.localeCompare(b.alpha)
      )
      .map(i => i.item)
);

export const selectOlapDimensionMap = createSelector(
  selectOlapDimensionItems,
  dimensions => Object.fromEntries(dimensions.map(item => [item.name, item]))
);

export const selectLevelTriadMap = createSelector(
  selectOlapCube,
  cube => !cube
    ? {}
    : Object.fromEntries(
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

export const selectOlapTimeDimension = createSelector(
  selectOlapDimensionItems,
  dimensions =>
    dimensions.find(
      d => d.dimensionType === "time" || d.name === "Year" || d.name === "Date"
    )
);

export const selectSerializedParams = createSelector(
  selectCurrentQueryParams,
  serializePermalink
);
