import {Classes} from "@blueprintjs/core";
import classNames from "classnames";
import React, {PureComponent} from "react";
import {connect} from "react-redux";
import ExplorerNavbar from "../components/ExplorerNavbar";
import LoadingScreen from "../components/LoadingScreen";
import {doClientSetup} from "../middleware/actions";
import {updateLocaleList} from "../state/server/actions";
import {selectServerState} from "../state/server/selectors";
import {selectIsDarkTheme} from "../state/ui/selectors";
import ExplorerParams from "./ExplorerParams";
import ExplorerQueries from "./ExplorerQueries";
import ExplorerResults from "./ExplorerResults";

/**
 * @typedef OwnProps
 * @property {string | import("axios").AxiosRequestConfig} src The URL for the data server.
 * @property {string} [title] A title to show on the navbar.
 * @property {string[]} locale A list of the available locale options
 */

/**
 * @typedef StateProps
 * @property {boolean} darkTheme
 * @property {boolean} isLoaded
 */

/**
 * @typedef DispatchProps
 * @property {(src: string) => any} setupClient
 * @property {(src: string[]) => any} updateLocaleList
 */

/**
 * @extends {PureComponent<OwnProps & StateProps & DispatchProps>}
 */
class ExplorerComponent extends PureComponent {
  constructor(props) {
    super(props);
    props.updateLocaleList(props.locale);
    props.setupClient(props.src);
  }

  componentDidUpdate(prevProps) {
    const {src, setupClient} = this.props;
    if (prevProps.src !== src) {
      setupClient(src);
    }
  }

  render() {
    const {darkTheme, title, isLoaded} = this.props;
    return (
      <div className={classNames("explorer-wrapper", {[Classes.DARK]: darkTheme})}>
        <LoadingScreen className="explorer-loading" />
        <ExplorerNavbar className="explorer-navbar" title={title} />
        <ExplorerQueries className="explorer-queries" />
        {isLoaded ? <ExplorerParams className="explorer-params" /> : <div/>}
        <ExplorerResults className="explorer-results" />
      </div>
    );
  }
}

ExplorerComponent.defaultProps = {
  locale: ["en"],
  title: process.env.REACT_APP_TITLE || "tesseract-olap"
};

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  darkTheme: selectIsDarkTheme(state),
  isLoaded: Boolean(selectServerState(state).online)
});

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  setupClient(src) {
    dispatch(doClientSetup(src));
  },
  updateLocaleList(locale) {
    dispatch(updateLocaleList(locale));
  }
});

export default connect(mapState, mapDispatch)(ExplorerComponent);
