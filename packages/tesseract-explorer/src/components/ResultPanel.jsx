import {NonIdealState} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import {connect} from "react-redux";
import {UITAB_RAW, UITAB_TABLE, UITAB_TREE} from "../actions/ui";
import AnimatedCube from "./AnimatedCube";
import PanelRawTab from "./RawTabPanel";
import PanelDataTable from "./TableTabPanel";
import PanelDataTree from "./TreeTabPanel";

function ResultPanel(props) {
  if (props.error) {
    return (
      <NonIdealState
        className={classNames("initial-view error", props.className)}
        icon="error"
        description={
          <div className="error-description">
            <p>There was a problem with the last query.</p>
            <p>{"Server response: " + props.error}</p>
          </div>
        }
      />
    );
  }

  const {data} = props.aggregation;
  if (props.loading || data.length === 0) {
    return (
      <NonIdealState
        className={classNames("initial-view", props.className)}
        icon={<AnimatedCube />}
      />
    );
  }

  switch (props.currentTab) {
    case UITAB_TREE:
      return <PanelDataTree className={props.className} {...props.aggregation} />;
    case UITAB_RAW:
      return <PanelRawTab className={props.className} {...props.aggregation} />;
    case UITAB_TABLE:
    default:
      return <PanelDataTable className={props.className} {...props.aggregation} />;
  }
}

/** @param {import("../reducers").ExplorerState} state */
function mapStateToProps(state) {
  return {
    aggregation: state.explorerAggregation,
    currentTab: state.explorerUi.tab,
    error: state.explorerLoading.error,
    loading: state.explorerLoading.loading
  };
}

export default connect(mapStateToProps)(ResultPanel);
