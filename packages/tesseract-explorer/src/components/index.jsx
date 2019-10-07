import {Classes, NonIdealState} from "@blueprintjs/core";
import classNames from "classnames";
import React, {PureComponent} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {connect} from "react-redux";
import {setupClient} from "../actions/client";
import {updateLocaleList} from "../actions/ui";
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
 * @property {string} [title] A title to show on the navbar.
 * @property {string[]} locale A list of the available locale options
 */

/**
 * @typedef StateProps
 * @property {boolean} darkTheme
 * @property {boolean} emptyDataset
 * @property {boolean | undefined} serverOnline
 * @property {string} serverUrl
 */

/**
 * @typedef DispatchProps
 * @property {(src: string) => any} setupClient
 * @property {(src: string[]) => any} updateLocaleList
 */

/**
 * The ExplorerUI component unit
 * @class ExplorerComponent
 * @augments React.PureComponent<OwnProps&StateProps&DispatchProps>
 */
class ExplorerComponent extends PureComponent {
  constructor(props) {
    super(props);
    props.setupClient(props.src);
    props.updateLocaleList(props.locale);
  }

  componentDidUpdate(prevProps) {
    const {src, setupClient} = this.props;
    if (prevProps.src !== src) {
      setupClient(src);
    }
  }

  render() {
    const {darkTheme, serverOnline, serverUrl, title, emptyDataset} = this.props;
    return (
      <div className={classNames("explorer-wrapper", {[Classes.DARK]: darkTheme})}>
        <Navbar className="explorer-navbar" title={title} />
        <LoadingScreen className="explorer-loading" />
        <ExplorerContent
          emptyDataset={emptyDataset}
          online={serverOnline}
          url={serverUrl}
        />
        <StarredDrawer />
        <DebugDrawer />
      </div>
    );
  }
}

ExplorerComponent.defaultProps = {
  locale: ["en"],
  title: process.env.REACT_APP_TITLE || "tesseract-olap"
};

const ExplorerContent = function({online, url, emptyDataset}) {
  if (online === false) {
    return typeof window === "object" && window.navigator.onLine === false ? (
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
            {"Check the availability of the URL "}
            <a href={url} target="_blank" rel="noopener">
              {url}
            </a>.
          </span>
        }
      />
    );
  }
  else if (online === true) {
    return (
      <div className="explorer-content">
        <PerfectScrollbar className="explorer-params">
          <QueryPanel className="explorer-params-content" />
        </PerfectScrollbar>
        {emptyDataset ? (
          <NonIdealState
            className="explorer-error"
            icon="circle"
            title="The last query returned an empty dataset."
          />
        ) : (
          <ResultPanel className="explorer-results" />
        )}
      </div>
    );
  }
  else {
    return <NonIdealState className="explorer-loading" icon={<AnimatedCube />} />;
  }
};

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  return {
    darkTheme: state.explorerUi.darkTheme,
    emptyDataset: state.explorerAggregation.emptyDataset,
    serverOnline: state.explorerUi.serverOnline,
    serverUrl: state.explorerUi.serverUrl
  };
}

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
function mapDispatchToProps(dispatch) {
  return {
    setupClient: src => dispatch(setupClient(src)),
    updateLocaleList: locale => dispatch(updateLocaleList(locale))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerComponent);
