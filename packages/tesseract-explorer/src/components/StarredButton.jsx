import {Button} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {toggleStarredDrawer} from "../actions/ui";

/**
 * @typedef OwnProps
 * @property {boolean} disabled
 */

/**
 * @typedef DispatchProps
 * @property {() => any} toggleDrawerHandler
 */

/** @type {React.FC<OwnProps & DispatchProps>} */
const StarredButton = function(props) {
  return (
    <Button
      disabled={props.disabled}
      icon="star"
      large={true}
      minimal={true}
      onClick={props.toggleDrawerHandler}
    />
  );
}

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
function mapDispatchToProps(dispatch) {
  return {
    toggleDrawerHandler() {
      dispatch(toggleStarredDrawer());
    }
  };
}

export default connect(null, mapDispatchToProps)(StarredButton);
