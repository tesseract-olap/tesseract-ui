import {Button, ButtonGroup} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {toggleDarkTheme, toggleDebugDrawer, toggleStarredDrawer} from "../actions/ui";

/**
 * @typedef StateProps
 * @property {boolean} darkTheme
 */

/**
 * @typedef DispatchProps
 * @property {() => any} toggleDebugDrawerHandler
 * @property {() => any} toggleStarredDrawerHandler
 * @property {() => any} toggleThemeHandler
 */

/** @type {React.FC<StateProps & DispatchProps>} */
const NavbarButtons = function(props) {
  return (
    <ButtonGroup large={true} minimal={true}>
      <Button
        className="button-toggle-theme"
        icon={props.darkTheme ? "flash" : "moon"}
        onClick={props.toggleThemeHandler}
      />
      <Button
        className="button-toggle-starred"
        icon="star"
        onClick={props.toggleStarredDrawerHandler}
      />
      <Button
        className="button-toggle-debug"
        icon="code-block"
        onClick={props.toggleDebugDrawerHandler}
      />
    </ButtonGroup>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, {}, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  return {
    darkTheme: state.explorerUi.darkTheme
  };
}

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, {}>} */
function mapDispatchToProps(dispatch) {
  return {
    toggleDebugDrawerHandler() {
      return dispatch(toggleDebugDrawer());
    },
    toggleStarredDrawerHandler() {
      return dispatch(toggleStarredDrawer());
    },
    toggleThemeHandler() {
      return dispatch(toggleDarkTheme());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavbarButtons);
