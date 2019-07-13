import {NonIdealState} from "@blueprintjs/core";
import cn from "classnames";
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
        className={cn("initial-view error", props.className)}
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

  if (props.loading || props.data.length === 0) {
    return (
      <NonIdealState
        className={cn("initial-view", props.className)}
        icon={<AnimatedCube />}
      />
    );
  }

  switch (props.currentTab) {
    case UITAB_TREE:
      return <PanelDataTree {...props} />;
    case UITAB_RAW:
      return <PanelRawTab {...props} />;
    case UITAB_TABLE:
    default:
      return <PanelDataTable {...props} />;
  }
}

/** @param {import("../reducers").ExplorerState} state */
function mapStateToProps(state) {
  return {
    error: state.explorerLoading.error,
    loading: state.explorerLoading.loading,
    currentTab: state.explorerUi.tab,
    data: state.explorerAggregation.data
  };
}

export default connect(mapStateToProps)(ResultPanel);
