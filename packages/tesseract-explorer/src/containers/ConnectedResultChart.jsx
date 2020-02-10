import {lazy} from "react";
import {connect} from "react-redux";
import {doChartCodeUpdate, doChartTypeUpdate} from "../state/results/actions";
import {selectChartConfigText, selectChartType, selectCurrentQueryResult} from "../state/results/selectors";
import {selectIsDarkTheme} from "../state/ui/selectors";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {string} chartConfigCode
 * @property {string} chartType
 * @property {boolean} isDarkTheme
 * @property {QueryResult} result
 */

/**
 * @typedef DispatchProps
 * @property {(code: string) => void} updateConfigHandler
 * @property {(type: string) => void} updateTypeHandler
 */

const ConnectedResultChart = lazy(() => import("../components/ResultChart"));

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  chartConfigCode: selectChartConfigText(state),
  chartType: selectChartType(state),
  isDarkTheme: selectIsDarkTheme(state),
  result: selectCurrentQueryResult(state)
});

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  updateConfigHandler(code) {
    dispatch(doChartCodeUpdate(code));
  },
  updateTypeHandler(chartType) {
    dispatch(doChartTypeUpdate(chartType));
  }
});

export default connect(mapState, mapDispatch)(ConnectedResultChart);
