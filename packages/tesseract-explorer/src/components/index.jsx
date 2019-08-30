import {Classes, NonIdealState} from "@blueprintjs/core";
import classNames from "classnames";
import React, {PureComponent} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {connect} from "react-redux";
import {setupClient} from "../actions/client";
import AnimatedCube from "./AnimatedCube";
import DebugDrawer from "./DebugDrawer";
import LoadingScreen from "./LoadingScreen";
import Navbar from "./Navbar";
import QueryPanel from "./PanelQuery";
import ResultPanel from "./PanelResult";
import StarredDrawer from "./StarredDrawer";

/**
 * @typedef OwnProps
 * @property {string} src The URL for the data server.
 * @property {string} [title="tesseract-olap"] A title to show on the navbar.
 */

/**
 * @typedef StateProps
 * @property {string} serverStatus
 * @property {string} serverUrl
 * @property {boolean} darkTheme
 */

/**
 * @typedef DispatchProps
 * @property {(src: string) => any} setupClient
 */

/**
 * The ExplorerUI component unit
 * @class ExplorerComponent
 * @extends {React.PureComponent<OwnProps & StateProps & DispatchProps>}
 */
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
        <Navbar className="explorer-navbar" title={props.title} />
        <LoadingScreen />
        {this.renderContent(props.serverStatus, props.serverUrl)}
        <StarredDrawer />
        <DebugDrawer />
      </div>
    );
  }

  renderContent(status, url) {
    if (status === "error") {
      return window.navigator.onLine === false ? (
        <NonIdealState
          className="explorer-error"
          icon="globe-network"
          title="You are not connected to the internet."
        />
      ) : (
        <NonIdealState
          className="explorer-error"
          icon="error"
          title="There's a problem contacting with the server"
          description={
            <span>
              Check the availability of the URL{" "}
              <a href={url} target="_blank" rel="noopener">
                {url}
              </a>.
            </span>
          }
        />
      );
    }
    else if (status === "ok") {
      return (
        <div className="explorer-content">
          <PerfectScrollbar className="explorer-params">
            <QueryPanel className="explorer-params-content" />
          </PerfectScrollbar>
          <ResultPanel className="explorer-results" />
        </div>
      );
    }
    else {
      return <NonIdealState className="explorer-loading" icon={<AnimatedCube />} />;
    }
  }
}

ExplorerComponent.defaultProps = {
  title: process.env.REACT_APP_TITLE || "tesseract-olap"
};

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  return {
    darkTheme: state.explorerUi.darkTheme,
    serverStatus: state.explorerUi.serverStatus,
    serverUrl: state.explorerUi.serverUrl
  };
}

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
function mapDispatchToProps(dispatch) {
  return {
    setupClient: src => dispatch(setupClient(src))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerComponent);
