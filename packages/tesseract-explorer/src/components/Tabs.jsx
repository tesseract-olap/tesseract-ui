import {Tab, Tabs as Bp3Tabs} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";

import {UI_TABS_SELECT} from "../actions/ui";
import {TAB_RAW, TAB_TABLE, TAB_TREE} from "../reducers/uiReducer";

function Tabs(props) {
  return (
    <Bp3Tabs
      className={props.className}
      id="module-tabs"
      large={true}
      onChange={props.onTabSelected}
      selectedTabId={props.currentTab}
    >
      <Tab id={TAB_TABLE} title="Table" />
      <Tab id={TAB_TREE} title="Tree" />
      <Tab id={TAB_RAW} title="Raw JSON" />
    </Bp3Tabs>
  );
}

/** @param {import("../reducers").ExplorerState} state */
function mapStateToProps(state) {
  return {
    currentTab: state.explorerUi.tab
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onTabSelected: payload => dispatch({type: UI_TABS_SELECT, payload})
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
