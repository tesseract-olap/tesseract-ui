import {Tab, Tabs as Bp3Tabs} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {setTabPanel, UITAB_RAW, UITAB_TABLE, UITAB_TREE} from "../actions/ui";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {string} currentTab
 */

/**
 * @typedef DispatchProps
 * @property {(tab: string) => any} onTabSelected
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const Tabs = function(props) {
  return (
    <Bp3Tabs
      className={props.className}
      id="module-tabs"
      large={true}
      onChange={props.onTabSelected}
      selectedTabId={props.currentTab}
    >
      <Tab id={UITAB_TABLE} title="Table" />
      <Tab id={UITAB_TREE} title="Tree" />
      <Tab id={UITAB_RAW} title="Raw JSON" />
    </Bp3Tabs>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, {}, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  return {
    currentTab: state.explorerUi.tab
  };
}

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, {}>} */
function mapDispatchToProps(dispatch) {
  return {
    onTabSelected(tab) {
      dispatch(setTabPanel(tab));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
