import {Icon, NonIdealState, Tab, Tabs} from "@blueprintjs/core";
import classNames from "classnames";
import React, {Suspense, useState} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {selectLoadingState} from "../state/loading/selectors";
import {selectCurrentQueryItem} from "../state/queries/selectors";
import {selectOlapCube} from "../state/selectors";
import {selectServerState} from "../state/server/selectors";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {BlueprintCore.IconName | React.ReactElement | React.ReactFragment | false} transientIcon
 * @property {Record<string, React.FunctionComponent | React.ComponentClass>} panels
 */

/** @type {React.FC<OwnProps>} */
export const ExplorerResults = props => {
  const {panels, transientIcon} = props;
  const [currentTab, setCurrentTab] = useState(Object.keys(panels)[0]);

  const serverStatus = useSelector(selectServerState);
  const {loading: isLoading} = useSelector(selectLoadingState);
  const cube = useSelector(selectOlapCube);
  const queryItem = useSelector(selectCurrentQueryItem);

  const {online: isServerOnline, url: serverUrl} = serverStatus;
  const {isDirty: isDirtyQuery, params, result} = queryItem;
  const {data, error} = result;

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

  if (isServerOnline === false) {
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
          <a href={serverUrl} target="_blank" rel="noopener noreferrer">{serverUrl}</a>.
        </span>
      }
    />;
  }

  if (isLoading || isDirtyQuery) {
    return (
      <NonIdealState
        className={classNames("initial-view loading", props.className)}
        icon={transientIcon}
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
    <div className={classNames("explorer-column flex flex-col", props.className)}>
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
        <Suspense fallback={typeof transientIcon === "string" ? <Icon name={transientIcon} /> : transientIcon}>
          <CurrentComponent className="result-panel" cube={cube} params={params} result={result} />
        </Suspense>
      </div>
    </div>
  );
};
