import classNames from "classnames";
import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import LoadingScreen from "../components/LoadingScreen";
import ResultPivot from "../components/ResultPivot";
import ResultRaw from "../components/ResultRaw";
import ResultTable from "../components/ResultTable";
import {doClientSetup} from "../middleware/actions";
import {updateLocaleList} from "../state/server/actions";
import {selectServerState} from "../state/server/selectors";
import {ExplorerParams} from "./ExplorerParams";
import ExplorerQueries from "./ExplorerQueries";
import ExplorerResults from "./ExplorerResults";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {string[]} [locale] A list of the available locale options
 * @property {string | import("axios").AxiosRequestConfig} src The URL for the data server.
 * @property {Record<string, React.FunctionComponent | React.ComponentClass>} [panels]
 * @property {boolean} [enableGrowth] Enables the Growth parameter group in the parameters panel.
 * @property {boolean} [enableRca] Enables the Rca parameter group in the parameters panel.
 * @property {boolean} [enableTopk] Enables the Topk parameter group in the parameters panel.
 */

/**
 * @typedef StateProps
 * @property {boolean} isLoaded
 */

/**
 * @typedef DispatchProps
 * @property {(src: string | import("axios").AxiosRequestConfig) => any} setupClient
 * @property {(locale: string[]) => any} updateLocaleList
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const ExplorerComponent = props => {
  const [availableLocale] = useState(props.locale);

  useEffect(() => {
    props.updateLocaleList(props.locale);
    props.setupClient(props.src);
  }, [availableLocale, props.src]);

  return (
    <div className={classNames("explorer-wrapper", props.className)}>
      <LoadingScreen className="explorer-loading" />
      {props.isLoaded
        ? <ExplorerQueries className="explorer-queries" />
        : <div/>
      }
      {props.isLoaded
        ? <ExplorerParams
          className="explorer-params"
          enableGrowth={props.enableGrowth}
          enableRca={props.enableRca}
          enableTopk={props.enableTopk}
        />
        : <div/>
      }
      <ExplorerResults className="explorer-results" panels={props.panels} />
    </div>
  );
};

ExplorerComponent.defaultProps = {
  locale: ["en"],
  panels: {
    "Data table": ResultTable,
    "Pivot table": ResultPivot,
    "Raw response": ResultRaw
  }
};

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  isLoaded: Boolean(selectServerState(state).online)
});

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  setupClient(src) {
    dispatch(doClientSetup(src));
  },
  updateLocaleList(locale) {
    dispatch(updateLocaleList(locale));
  }
});

/** @type {import("react-redux").MergeProps<StateProps, DispatchProps, OwnProps, OwnProps & StateProps & DispatchProps>} */
const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export default connect(mapState, mapDispatch, mergeProps)(ExplorerComponent);
