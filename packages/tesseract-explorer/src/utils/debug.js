import {
  isActiveCut,
  isActiveItem,
  validGrowthState,
  validRcaState,
  validTopState
} from "./validation";
import {serializeCut, serializeFilter} from "./format";

/**
 * @param {import("../reducers/queryReducer").QueryState} query
 */
export function buildJavascriptCall(query) {
  const {growth, rca, top} = query;
  return (
    "query\n  " +
    []
      .concat(
        // drilldowns
        query.drilldowns
          .filter(isActiveItem)
          .map(item => `.addDrilldown("${item.drillable}")`),
        // measures
        query.measures.filter(isActiveItem).map(item => `.addMeasure("${item.measure}")`),
        // cuts
        query.cuts.filter(isActiveCut).map(item => {
          const members = item.members.filter(isActiveItem).map(m => m.key).join(`", "`);
          return `.addCut("${item.drillable}", ["${members}"])`;
        }),
        // filters
        query.filters
          .filter(isActiveItem)
          .map(
            item =>
              `.addFilter("${item.measure}", "${item.comparison}", "${item.interpretedValue}")`
          ),
        // growth
        validGrowthState(growth) && `.setGrowth("${growth.level}", "${growth.measure}")`,
        // rca
        validRcaState(rca) &&
          `.setRCA("${rca.level1}", "${rca.level2}", "${rca.measure}")`,
        // top
        validTopState(top) &&
          `.setTop("${top.amount}", "${top.level}", "${top.measure}", "${top.order}")`,
        // options
        ["parents", "sparse"].map(opt => `.setOption("${opt}", ${query[opt]})`)
      )
      .filter(Boolean)
      .join("\n  ")
  );
}
