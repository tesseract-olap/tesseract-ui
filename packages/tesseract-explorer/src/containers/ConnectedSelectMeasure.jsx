import {connect} from "react-redux";
import SelectMeasure from "../components/SelectMeasure";
import {selectOlapMeasureItems} from "../state/selectors";

/**
 * @typedef {Omit<import("../components/SelectMeasure").OwnProps, "items">} OwnProps
 */

/**
 * @typedef StateProps
 * @property {OlapMeasure[]} items
 */

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  items: selectOlapMeasureItems(state)
});

export default connect(mapState)(SelectMeasure);
