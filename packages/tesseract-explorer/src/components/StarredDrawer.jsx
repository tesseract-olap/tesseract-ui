import {Drawer} from "@blueprintjs/core";
import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {connect} from "react-redux";
import {toggleStarredDrawer} from "../actions/ui";
import StarredItem from "./StarredItem";

import "../style/starredDrawer.scss";

/**
 * @typedef StateProps
 * @property {string} currentPermalink
 * @property {boolean} isOpen
 * @property {import("../reducers").StarredItem[]} items
 */

/**
 * @typedef DispatchProps
 * @property {() => any} closeDrawerHandler
 */

/** @type {React.FC<StateProps & DispatchProps>} */
const StarredDrawer = function(props) {
  return (
    <Drawer
      className="starred-drawer"
      icon="star"
      isOpen={props.isOpen}
      onClose={props.closeDrawerHandler}
      size={Drawer.SIZE_STANDARD}
      title="Starred queries"
    >
      <PerfectScrollbar>
        <div className="starred-drawer-content">
          {props.items.map(item => (
            <StarredItem
              active={props.currentPermalink === item.key}
              item={item}
              key={item.key}
            />
          ))}
        </div>
      </PerfectScrollbar>
    </Drawer>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, {}, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  return {
    currentPermalink: state.explorerQuery.permalink,
    isOpen: state.explorerUi.starredDrawer,
    items: state.explorerStarred
  };
}

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, {}>} */
function mapDispatchToProps(dispatch) {
  return {
    closeDrawerHandler() {
      return dispatch(toggleStarredDrawer(false));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StarredDrawer);
