import { lazy } from "react";
import { connect, MapDispatchToPropsFunction, MapStateToProps } from "react-redux";
import { selectCubeName, selectDrilldownItems, selectMeasureItems } from "../state/params/selectors";
import { doUpdateMatrixColumns, doUpdateMatrixRows, doUpdateMatrixValues } from "../state/results/actions";
import { selectCurrentQueryResults, selectPivotValueMeasure } from "../state/results/selectors";

interface OwnProps {
  className?: string;
};

interface StateProps {
  cube: string;
  drilldowns: any[];
  measures: any[];
  result: any;
  valueMeasure: any;
};

interface DispatchProps {
  updateColumnsHandler(level: string): void;
  updateRowsHandler(level: string): void;
  updateValuesHandler(measure: string): void;
};

const ConnectedResultPivot = lazy(() => import("../components/ResultPivot"));

const mapState: MapStateToProps<StateProps, OwnProps, ExplorerState> = state => ({
  cube: selectCubeName(state),
  drilldowns: selectDrilldownItems(state),
  measures: selectMeasureItems(state),
  result: selectCurrentQueryResults(state),
  valueMeasure: selectPivotValueMeasure(state),
});

const mapDispatch: MapDispatchToPropsFunction<DispatchProps, OwnProps> = dispatch => ({
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
