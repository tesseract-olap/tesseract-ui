import {Button} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";

import {UI_STARRED_TOGGLE} from "../actions/ui";

function StarredButton(props) {
  return (
    <Button
      disabled={props.disabled}
      icon="code-block"
      large={true}
      minimal={true}
      onClick={props.toggleDrawerHandler}
    />
  );
}

function mapDispatchToProps(dispatch) {
  return {
    toggleDrawerHandler() {
      return dispatch({type: UI_STARRED_TOGGLE});
    }
  };
}

export default connect(null, mapDispatchToProps)(StarredButton);
