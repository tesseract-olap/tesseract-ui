import {NonIdealState, Tab, Tabs} from "@blueprintjs/core";
import classNames from "classnames";
import React, {Suspense, useState} from "react";
import {connect} from "react-redux";
import AnimatedCube from "../components/AnimatedCube";
import ResultRaw from "../components/ResultRaw";
import ResultTable from "../components/ResultTable";
import {selectLoadingState} from "../state/loading/selectors";
import {selectCurrentQueryItem} from "../state/queries/selectors";
import {selectCurrentQueryResult} from "../state/results/selectors";
import ConnectedResultChart from "./ConnectedResultChart";
import ConnectedResultPivot from "./ConnectedResultPivot";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {QueryResult} result
 * @property {boolean} isLoading
 * @property {boolean} isDirtyQuery
 */

/** @type {React.FC<OwnProps & StateProps>} */
const ExplorerResults = props => {
  const {data, error} = props.result;
  const [currentTab, setCurrentTab] = useState(UITAB_TABLE);

  if (error) {
    return (
      <NonIdealState
        className={classNames("initial-view error", props.className)}
        description={
          <div className="error-description">
            <p>There was a problem with the last query:</p>
            <p className="error-detail">{error}</p>
          </div>
        }
        icon="error"
      />
    );
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
        title="Empty dataset"
        description="The query didn't return elements. Try again with different parameters."
      />
    );
  }

  const CurrentComponent = ResultPanels[currentTab];

  return (
    <div className={classNames("explorer-column", props.className)}>
      <Tabs className="titlebar" onChange={setCurrentTab} selectedTabId={currentTab}>
        <Tab id={UITAB_TABLE} title="Spreadsheet" />
        <Tab id={UITAB_PIVOT} title="Pivot Table" />
        <Tab id={UITAB_CHART} title="Chart Builder" />
        <Tab id={UITAB_RAW} title="Raw response" />
        <Tabs.Expander />
        <h2 className="token">Results</h2>
      </Tabs>
      <div className={`wrapper ${props.className}-content`}>
        <Suspense fallback={<AnimatedCube />}>
          <CurrentComponent className="result-panel" {...props.result} />
        </Suspense>
      </div>
    </div>
  );
};

const UITAB_CHART = "tab-chart";
const UITAB_PIVOT = "tab-pivot";
const UITAB_RAW = "tab-raw";
const UITAB_TABLE = "tab-table";

const ResultPanels = {
  [UITAB_CHART]: ConnectedResultChart,
  [UITAB_PIVOT]: ConnectedResultPivot,
  [UITAB_RAW]: ResultRaw,
  [UITAB_TABLE]: ResultTable
};

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  result: selectCurrentQueryResult(state),
  isLoading: selectLoadingState(state).loading,
  isDirtyQuery: selectCurrentQueryItem(state).isDirty
});

export default connect(mapState)(ExplorerResults);
