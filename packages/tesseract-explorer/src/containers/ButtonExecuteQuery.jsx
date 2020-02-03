import {Button, Intent} from "@blueprintjs/core";
import {connect} from "react-redux";
import {doExecuteQuery} from "../middleware/actions";

/**
 * @typedef {import("@blueprintjs/core").IButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>} ButtonProps
 */

/**
 * @typedef StateProps
 * @property {boolean} fill
 * @property {import("@blueprintjs/core").IconName} icon
 * @property {import("@blueprintjs/core").Intent} intent
 * @property {string} text
 */

/**
 * @typedef DispatchProps
 * @property {() => void} onClick
 */

/** @type {import("react-redux").MapStateToProps<StateProps, ButtonProps, ExplorerState>} */
const mapState = () => ({
  fill: true,
  icon: "database",
  intent: Intent.PRIMARY,
  text: "Execute query"
});

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, ButtonProps>} */
const mapDispatch = dispatch => ({
  onClick() {
    dispatch(doExecuteQuery());
  }
});

export default connect(mapState, mapDispatch)(Button);
