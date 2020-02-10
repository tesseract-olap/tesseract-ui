import {lazy} from "react";
import {connect} from "react-redux";
import {selectCubeName} from "../state/params/selectors";
import {doUpdateMatrixColumns, doUpdateMatrixRows, doUpdateMatrixValues} from "../state/results/actions";
import {selectCurrentQueryResult, selectPivotValueMeasure} from "../state/results/selectors";
import {selectOlapLevelItemsFromParams, selectOlapMeasureItemsFromParams} from "../state/selectors";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {string} cube
 * @property {OlapLevel[]} drilldowns
 * @property {OlapMeasure[]} measures
 * @property {QueryResult} result
 * @property {OlapMeasure | undefined} valueMeasure
 */

/**
 * @typedef DispatchProps
 * @property {(level: string) => void} updateColumnsHandler
 * @property {(level: string) => void} updateRowsHandler
 * @property {(measure: string) => void} updateValuesHandler
 */

const ConnectedResultPivot = lazy(() => import("../components/ResultPivot"));

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  cube: selectCubeName(state),
  drilldowns: selectOlapLevelItemsFromParams(state),
  measures: selectOlapMeasureItemsFromParams(state),
  result: selectCurrentQueryResult(state),
  valueMeasure: selectPivotValueMeasure(state)
});

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  updateColumnsHandler(level) {
    dispatch(doUpdateMatrixColumns(level));
  },
  updateRowsHandler(level) {
    dispatch(doUpdateMatrixRows(level));
  },
  updateValuesHandler(measure) {
    dispatch(doUpdateMatrixValues(measure));
  }
});

export default connect(mapState, mapDispatch)(ConnectedResultPivot);
