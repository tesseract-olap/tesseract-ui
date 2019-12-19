import {Button, ButtonGroup} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import copy from "clipboard-copy";
import {toggleDarkTheme, toggleDebugDrawer, toggleStarredDrawer} from "../state/ui/actions";
import { selectPermalink } from "../selectors/permalink";

/**
 * @typedef StateProps
 * @property {boolean} darkTheme
 * @property {string} permalink
 */

/**
 * @typedef DispatchProps
 * @property {() => any} copyPermalink
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
        title={props.darkTheme ? "Switch to light theme" : "Switch to dark theme"}
      />
      <Button
        className="button-toggle-starred"
        icon="star"
        onClick={props.toggleStarredDrawerHandler}
        title="Starred items drawer"
      />
      <Button
        className="button-toggle-debug"
        icon="code-block"
        onClick={props.toggleDebugDrawerHandler}
        title="Debug drawer"
      />
      <Button
        className="button-copy-permalink"
        icon="link"
        onClick={props.copyPermalink.bind(null, props.permalink)}
        title="Copy permalink"
      />
    </ButtonGroup>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, {}, ExplorerState>} */
function mapStateToProps(state) {
  return {
    darkTheme: state.explorerUi.darkTheme,
    permalink: selectPermalink(state)
  };
}

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, {}>} */
function mapDispatchToProps(dispatch) {
  return {
    copyPermalink(permalink, evt) {
      evt.stopPropagation();
      const {origin, pathname} = window.location;
      return copy(`${origin}${pathname}?${decodeURI(`${permalink}`)}`);
    },
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
