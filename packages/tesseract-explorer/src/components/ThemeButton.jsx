import {Button} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";

import {UI_THEME_TOGGLE} from "../actions/ui";

function ThemeButton(props) {
  return (
    <Button
      icon={props.darkTheme ? "flash" : "moon"}
      large={true}
      minimal={true}
      onClick={props.toggleThemeHandler}
    />
  );
}

/** @param {import("../reducers").ExplorerState} state */
function mapStateToProps(state) {
  return {
    darkTheme: state.explorerUi.darkTheme
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleThemeHandler() {
      return dispatch({type: UI_THEME_TOGGLE});
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ThemeButton);
