import {Classes} from "@blueprintjs/core";
import classNames from "classnames";
import React, {PureComponent} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {connect} from "react-redux";

import {setupClient} from "../actions/client";
import DebugDrawer from "./DebugDrawer";
import DisplayedComponent from "./DisplayedComponent";
import LoadingScreen from "./LoadingScreen";
import Navbar from "./Navbar";
import QueryPanel from "./QueryPanel";
import StarredDrawer from "./StarredDrawer";

class ExplorerComponent extends PureComponent {
  constructor(props) {
    super(props);
    props.setupClient(props.src);
  }

  componentDidUpdate(prevProps) {
    const {src, setupClient} = this.props;
    if (prevProps.src !== src) {
      setupClient(src);
    }
  }

  render() {
    const props = this.props;
    return (
      <div className={classNames("explorer-wrapper", {[Classes.DARK]: props.darkTheme})}>
        <Navbar
          className="explorer-navbar"
          serverStatus={props.serverStatus}
          serverVersion={props.serverVersion}
          serverUrl={props.serverUrl}
          title={props.title}
        />
        <LoadingScreen />
        <div className="explorer-content">
          <PerfectScrollbar className="explorer-params">
            <QueryPanel className="explorer-params-content" />
          </PerfectScrollbar>
          <DisplayedComponent className="explorer-results" />
        </div>
        <StarredDrawer />
        <DebugDrawer />
      </div>
    );
  }
}

ExplorerComponent.defaultProps = {
  defaultLocale: "en"
};

/** @param {import("../reducers").ExplorerState} state */
function mapStateToProps(state) {
  return {
    currentTab: state.explorerUi.tab,
    darkTheme: state.explorerUi.darkTheme,
    serverStatus: state.explorerUi.serverStatus,
    serverUrl: state.explorerUi.serverUrl,
    serverVersion: state.explorerUi.serverVersion
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setupClient: src => dispatch(setupClient(src))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerComponent);
