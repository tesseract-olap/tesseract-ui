import {connect} from "react-redux";
import SelectMeasure from "../components/SelectMeasure";
import {selectOlapMeasureItems} from "../state/selectors";

/**
 * @typedef {Omit<import("../components/SelectMeasure").OwnProps, "items">} OwnProps
 */

/**
 * @typedef StateProps
 * @property {import("@datawheel/olap-client").AdaptedMeasure[]} items
 */

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  items: selectOlapMeasureItems(state)
});

export default connect(mapState)(SelectMeasure);
