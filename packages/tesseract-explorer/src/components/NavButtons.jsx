import {Button, ButtonGroup} from "@blueprintjs/core";
import copy from "clipboard-copy";
import React from "react";
import {connect} from "react-redux";
import {doParseQueryUrl} from "../middleware/actions";
import {selectPermalink} from "../middleware/selectors";
import {toggleDarkTheme} from "../state/ui/actions";
import {selectIsDarkTheme} from "../state/ui/selectors";

/**
 * @typedef StateProps
 * @property {string} [className]
 * @property {boolean} darkTheme
 * @property {string} permalink
 */

/**
 * @typedef DispatchProps
 * @property {() => any} copyPermalink
 * @property {() => any} toggleThemeHandler
 * @property {() => any} parseQueryUrlHandler
 */

/** @type {React.FC<StateProps & DispatchProps>} */
const NavbarButtons = props =>
  <ButtonGroup className={props.className} large={true} minimal={true}>
    <Button
      className="button-parseurl"
      icon="bring-data"
      onClick={props.parseQueryUrlHandler}
      title="Parse query URL" />
    <Button
      className="button-toggle-theme"
      icon={props.darkTheme ? "flash" : "moon"}
      onClick={props.toggleThemeHandler}
      title={props.darkTheme ? "Switch to light theme" : "Switch to dark theme"}
    />
    <Button
      className="button-copy-permalink"
      icon="link"
      onClick={props.copyPermalink.bind(null, props.permalink)}
      title="Copy permalink"
    />
  </ButtonGroup>;

/** @type {import("react-redux").MapStateToProps<StateProps, {}, ExplorerState>} */
const mapState = state => ({
  darkTheme: selectIsDarkTheme(state),
  permalink: selectPermalink(state)
});

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, {}>} */
const mapDispatch = dispatch => ({
  copyPermalink(permalink, evt) {
    evt.stopPropagation();
    const {origin, pathname} = window.location;
    return copy(`${origin}${pathname}?${decodeURI(`${permalink}`)}`);
  },
  toggleThemeHandler() {
    return dispatch(toggleDarkTheme());
  },
  parseQueryUrlHandler() {
    const string = window.prompt("Enter the URL of the query you want to parse:");
    if (string) {
      const url = new URL(string);
      dispatch(doParseQueryUrl(url.toString()));
    }
  }
});


export default connect(mapState, mapDispatch)(NavbarButtons);
