import {Classes, Drawer} from "@blueprintjs/core";
import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {connect} from "react-redux";

import {UI_STARRED_TOGGLE} from "../actions/ui";

function StarredDrawer(props) {
  return (
    <Drawer
      className="starred-drawer"
      icon="code-block"
      isOpen={props.isOpen}
      onClose={props.closeDrawerHandler}
      size={Drawer.SIZE_STANDARD}
      title="Starred queries"
    >
      <PerfectScrollbar>
        <div className="starred-drawer-content">
          {props.items.map(item => (
            <div key={item.hash} className="starred-drawer-item">
              <details>
                <summary>{item.date}</summary>
                <pre className={Classes.CODE_BLOCK}>
                  {JSON.stringify(item.query, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      </PerfectScrollbar>
    </Drawer>
  );
}

/** @param {import("../reducers").ExplorerState} state */
function mapStateToProps(state) {
  return {
    isOpen: state.explorerUi.starredDrawer,
    items: state.explorerStarred.items
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeDrawerHandler() {
      return dispatch({type: UI_STARRED_TOGGLE, payload: false});
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StarredDrawer);
