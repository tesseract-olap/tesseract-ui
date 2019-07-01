import cn from "classnames";
import React, {PureComponent} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {connect} from "react-redux";

import {initializeClient} from "../utils/api";
import DebugDrawer from "./DebugDrawer";
import DisplayedComponent from "./DisplayedComponent";
import LoadingScreen from "./LoadingScreen";
import Navbar from "./Navbar";
import QueryPanel from "./QueryPanel";
import StarredDrawer from "./StarredDrawer";

class ExplorerComponent extends PureComponent {
  constructor(props) {
    super(props);
    if (!props.serverStatus || props.serverUrl !== props.src) {
      initializeClient(props.dispatch, props.src);
    }
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (prevProps.src !== props.src) {
      initializeClient(props.dispatch, props.src);
    }
  }

  render() {
    const props = this.props;
    return (
      <div className={cn("explorer-wrapper", {"bp3-dark": props.darkTheme})}>
        <LoadingScreen />
        <Navbar
          className="explorer-navbar"
          serverStatus={props.serverStatus}
          serverVersion={props.serverVersion}
          title={props.title}
        />
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

function mapStateToProps(state) {
  return {
    currentTab: state.explorerUi.tab,
    darkTheme: state.explorerUi.darkTheme,
    serverStatus: state.explorerUi.serverStatus,
    serverUrl: state.explorerUi.serverUrl,
    serverVersion: state.explorerUi.serverVersion
  };
}

export default connect(mapStateToProps)(ExplorerComponent);
