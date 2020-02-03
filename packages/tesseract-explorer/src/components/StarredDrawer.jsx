import {Drawer} from "@blueprintjs/core";
import React, {memo} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {connect} from "react-redux";
import {toggleStarredDrawer} from "../actions/ui";
import {selectPermalink} from "../selectors/permalink";
import "../style/starredDrawer.scss";
import {shallowEqualExceptFns} from "../utils/validation";
import StarredItem from "./StarredItem";
import { selectQueryState, selectStarredState, selectUiState } from "../selectors/state";

/**
 * @typedef StateProps
 * @property {string} currentPermalink
 * @property {import("../reducers").QueryState} query
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
    currentPermalink: selectPermalink(state),
    isOpen: selectUiState(state).starredDrawer,
    items: selectStarredState(state),
    query: selectQueryState(state)
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

export default connect(mapStateToProps, mapDispatchToProps)(
  memo(StarredDrawer, shallowEqualExceptFns)
);
