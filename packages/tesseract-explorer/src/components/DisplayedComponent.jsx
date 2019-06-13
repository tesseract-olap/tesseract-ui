import {NonIdealState} from "@blueprintjs/core";
import cn from "classnames";
import React from "react";
import {connect} from "react-redux";

import {TAB_RAW, TAB_TABLE, TAB_TREE} from "../reducers/uiReducer";
import AnimatedCube from "./AnimatedCube";
import RawTabPanel from "./RawTabPanel";
import PanelDataTable from "./TableTabPanel";
import PanelDataTree from "./TreeTabPanel";

function DisplayedComponent(props) {
  if (props.data.length === 0) {
    return (
      <NonIdealState
        className={cn("initial-view", props.className)}
        icon={<AnimatedCube />}
      />
    );
  }
  switch (props.currentTab) {
    case TAB_TREE:
      return <PanelDataTree {...props} />;
    case TAB_RAW:
      return <RawTabPanel {...props} />;
    case TAB_TABLE:
    default:
      return <PanelDataTable {...props} />;
  }
}

function mapStateToProps(state) {
  return {
    currentTab: state.explorerUi.tab,
    data: state.explorerDataset.data
  };
}

export default connect(mapStateToProps)(DisplayedComponent);
