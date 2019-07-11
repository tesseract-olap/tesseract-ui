export const AGGREGATION_UPDATE = "explorer/AGGREGATION/UPDATE";

export const updateAggregation = (aggregation, urls) => ({
  type: AGGREGATION_UPDATE,
  payload: {aggregation, urls}
});
