import {connect} from "react-redux";
import ResultChart from "./ResultChart";
import {doChartCodeUpdate, doChartTypeUpdate} from "../../tesseract-explorer/src/state/results/actions";
import {selectChartConfigText, selectChartType, selectCurrentQueryResult} from "../../tesseract-explorer/src/state/results/selectors";
import {selectIsDarkTheme} from "../../tesseract-explorer/src/state/ui/selectors";

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

export default connect(mapState, mapDispatch)(ResultChart);
