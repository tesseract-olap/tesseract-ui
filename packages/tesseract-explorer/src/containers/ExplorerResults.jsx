import {NonIdealState, Tab, Tabs} from "@blueprintjs/core";
import classNames from "classnames";
import React, {Suspense, useState} from "react";
import {connect} from "react-redux";
import {AnimatedCube} from "../components/AnimatedCube";
import {useTranslation} from "../hooks/translation";
import {selectLoadingState} from "../state/loading/selectors";
import {selectCurrentQueryParams} from "../state/params/selectors";
import {selectCurrentQueryItem} from "../state/queries/selectors";
import {selectCurrentQueryResult} from "../state/results/selectors";
import {selectOlapCube} from "../state/selectors";
import {selectServerState} from "../state/server/selectors";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {Record<string, React.FunctionComponent | React.ComponentClass>} panels
 */

/**
 * @typedef StateProps
 * @property {OlapClient.PlainCube} cube
 * @property {boolean} isDirtyQuery
 * @property {boolean} isLoading
 * @property {boolean | undefined} isServerOnline
 * @property {string} serverUrl
 * @property {TessExpl.Struct.QueryParams} params
 * @property {TessExpl.Struct.QueryResult} result
 */

/** @type {React.FC<OwnProps & StateProps>} */
const ExplorerResults = props => {
  const {panels} = props;
  const {data, error} = props.result;
  const [currentTab, setCurrentTab] = useState(Object.keys(panels)[0]);

  const {translate: t} = useTranslation();

  if (error) {
    return (
      <NonIdealState
        className={classNames("initial-view error", props.className)}
        description={
          <div className="error-description">
            <p>{t("results.error_execquery_detail")}</p>
            <p className="error-detail">{error}</p>
          </div>
        }
        icon="error"
      />
    );
  }

  if (props.isServerOnline === false) {
    if (typeof window === "object" && window.navigator.onLine === false) {
      return <NonIdealState
        className="explorer-error"
        icon="globe-network"
        title={t("results.error_disconnected_title")}
      />;
    }

    return <NonIdealState
      className="explorer-error"
      icon="error"
      title={t("results.error_serveroffline_title")}
      description={
        <span>
          {t("results.error_serveroffline_detail")}
          <a href={props.serverUrl} target="_blank" rel="noopener noreferrer">{props.serverUrl}</a>.
        </span>
      }
    />;
  }

  if (props.isLoading || props.isDirtyQuery) {
    return (
      <NonIdealState
        className={classNames("initial-view loading", props.className)}
        icon={<AnimatedCube />}
      />
    );
  }

  if (data.length === 0) {
    return (
      <NonIdealState
        className={classNames("initial-view empty", props.className)}
        icon="square"
        title={t("results.error_emptyresult_title")}
        description={t("results.error_emptyresult_detail")}
      />
    );
  }

  const CurrentComponent = panels[currentTab];

  return (
    <div className={classNames("explorer-column", props.className)}>
      <Tabs
        className="titlebar"
        onChange={newTab => setCurrentTab(`${newTab}`)}
        selectedTabId={currentTab}
      >
        {Object.keys(panels).map(key => <Tab id={key} key={key} title={t(key)} />)}
        <Tabs.Expander />
        <h2 className="token">{t("results.count_rows", {n: data.length})}</h2>
      </Tabs>
      <div className={`wrapper ${props.className}-content`}>
        <Suspense fallback={<AnimatedCube />}>
          <CurrentComponent className="result-panel" cube={props.cube} params={props.params} result={props.result} />
        </Suspense>
      </div>
    </div>
  );
};

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  isDirtyQuery: selectCurrentQueryItem(state).isDirty,
  isLoading: selectLoadingState(state).loading,
  isServerOnline: selectServerState(state).online,
  serverUrl: selectServerState(state).url,
  cube: selectOlapCube(state),
  params: selectCurrentQueryParams(state),
  result: selectCurrentQueryResult(state)
});

export default connect(mapState)(ExplorerResults);
