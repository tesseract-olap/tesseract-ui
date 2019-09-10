import {
  isActiveCut,
  isActiveItem,
  validGrowthState,
  validRcaState,
  validTopkState
} from "./validation";

/**
 * @param {import("../reducers").QueryState} query
 */
export function buildJavascriptCall(query) {
  const {growth, rca, topk} = query;

  const levelRefToString = ref =>
    `{"dimension": "${ref.dimension}", "hierarchy": "${ref.hierarchy}", "level": "${ref.level}"}`;

  return ["query"]
    .concat(
      // drilldowns
      query.drilldowns
        .filter(isActiveItem)
        .map(item => `.addDrilldown(${levelRefToString(item)})`),
      // measures
      query.measures.filter(isActiveItem).map(item => `.addMeasure("${item.measure}")`),
      // cuts
      query.cuts.filter(isActiveCut).map(item => {
        const members = item.members.filter(isActiveItem).map(m => `"${m.key}"`);
        return `.addCut(${levelRefToString(item)}, [${members.join(`, `)}])`;
      }),
      // filters
      query.filters
        .filter(isActiveItem)
        .map(
          item =>
            `.addFilter("${item.measure}", "${item.comparison}", "${item.interpretedValue}")`
        ),
      // growth
      validGrowthState(growth)
        ? `.setGrowth("${growth.level}", "${growth.measure}")`
        : "",
      // rca
      validRcaState(rca)
        ? `.setRCA("${rca.level1}", "${rca.level2}", "${rca.measure}")`
        : "",
      // top
      validTopkState(topk)
        ? `.setTop("${topk.amount}", "${topk.level}", "${topk.measure}", "${topk.order}")`
        : "",
      // options
      ["debug", "distinct", "nonempty", "parents", "sparse"].map(
        opt => `.setOption("${opt}", ${query[opt]})`
      )
    )
    .filter(Boolean)
    .join("\n  ");
}
