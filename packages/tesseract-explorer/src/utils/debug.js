import {
  isActiveCut,
  isActiveItem,
  validGrowthState,
  validRcaState,
  validTopkState
} from "./validation";

/**
 * @param {import("../reducers/queryReducer").QueryState} query
 */
export function buildJavascriptCall(query) {
  const {growth, rca, topk} = query;
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
        validTopkState(topk) &&
          `.setTop("${topk.amount}", "${topk.level}", "${topk.measure}", "${topk.order}")`,
        // options
        ["parents", "sparse"].map(opt => `.setOption("${opt}", ${query[opt]})`)
      )
      .filter(Boolean)
      .join("\n  ")
  );
}
