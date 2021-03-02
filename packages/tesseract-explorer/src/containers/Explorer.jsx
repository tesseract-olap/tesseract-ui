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
import {TranslationProvider} from "../utils/localization";
import {ExplorerParams} from "./ExplorerParams";
import ExplorerQueries from "./ExplorerQueries";
import ExplorerResults from "./ExplorerResults";

/**
 * @typedef StateProps
 * @property {boolean} isLoaded
 */

/**
 * @typedef DispatchProps
 * @property {(src: string | import("axios").AxiosRequestConfig) => any} setupClient
 * @property {(locale: string[]) => any} updateLocaleList
 */

/** @type {React.FC<Required<TessExpl.ExplorerProps> & StateProps & DispatchProps>} */
const ExplorerComponent = props => {
  const [availableLocale] = useState(props.locale);

  useEffect(() => {
    props.updateLocaleList(props.locale);
    props.setupClient(props.src);
  }, [availableLocale, props.src]);

  return (
    <TranslationProvider defaultLocale={props.uiLocale} translations={props.translations}>
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
    </TranslationProvider>
  );
};

ExplorerComponent.defaultProps = {
  locale: ["en"],
  uiLocale: "en",
  panels: {
    "Data table": ResultTable,
    "Pivot table": ResultPivot,
    "Raw response": ResultRaw
  }
};

/** @type {TessExpl.State.MapStateFn<StateProps, TessExpl.ExplorerProps>} */
const mapState = state => ({
  isLoaded: Boolean(selectServerState(state).online)
});

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, TessExpl.ExplorerProps>} */
const mapDispatch = dispatch => ({
  setupClient(src) {
    dispatch(doClientSetup(src));
  },
  updateLocaleList(locale) {
    dispatch(updateLocaleList(locale));
  }
});

/** @type {import("react-redux").MergeProps<StateProps, DispatchProps, TessExpl.ExplorerProps, TessExpl.ExplorerProps & StateProps & DispatchProps>} */
const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
});

export default connect(mapState, mapDispatch, mergeProps)(ExplorerComponent);
