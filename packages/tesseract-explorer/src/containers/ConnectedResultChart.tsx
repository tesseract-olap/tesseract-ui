import { lazy } from "react";
import { connect, MapDispatchToPropsFunction, MapStateToProps } from "react-redux";
import { doChartCodeUpdate, doChartTypeUpdate } from "../state/results/actions";
import { selectChartConfigText, selectChartType, selectCurrentQueryResults } from "../state/results/selectors";
import { selectIsDarkTheme } from "../state/ui/selectors";

interface OwnProps {
  className?: string;
};

interface StateProps {
  chartConfigCode: string;
  chartType: string;
  isDarkTheme: boolean;
  result: any;
};

interface DispatchProps {
  updateConfigHandler(code: string): void;
  updateTypeHandler(type: string): void;
};

const ConnectedResultChart = lazy(() => import("../components/ResultChart"));

const mapState: MapStateToProps<StateProps, OwnProps, ExplorerState> = state => ({
  chartConfigCode: selectChartConfigText(state),
  chartType: selectChartType(state),
  isDarkTheme: selectIsDarkTheme(state),
  result: selectCurrentQueryResults(state)
});

const mapDispatch: MapDispatchToPropsFunction<DispatchProps, OwnProps> = dispatch => ({
  updateConfigHandler(code) {
    dispatch(doChartCodeUpdate(code));
  },
  updateTypeHandler(chartType) {
    dispatch(doChartTypeUpdate(chartType));
  }
});

export default connect(mapState, mapDispatch)(ConnectedResultChart);
