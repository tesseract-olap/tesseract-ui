import {Drawer} from "@blueprintjs/core";
import React, {memo} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {connect} from "react-redux";
import {toggleStarredDrawer} from "../actions/ui";
import "../style/starredDrawer.scss";
import {serializePermalink} from "../utils/permalink";
import {shallowEqualExceptFns} from "../utils/validation";
import StarredItem from "./StarredItem";

/**
 * @typedef StateProps
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
  const currentPermalink = serializePermalink(props.query);
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
              active={currentPermalink === item.key}
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
    query: state.explorerQuery,
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

export default connect(mapStateToProps, mapDispatchToProps)(
  memo(StarredDrawer, shallowEqualExceptFns)
);
