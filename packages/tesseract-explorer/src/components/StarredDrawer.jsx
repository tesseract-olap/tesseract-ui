import {Drawer} from "@blueprintjs/core";
import React, {memo} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {connect} from "react-redux";
import {toggleStarredDrawer} from "../state/ui/actions";
import {selectPermalink} from "../selectors/permalink";
import "../style/starredDrawer.scss";
import {shallowEqualExceptFns} from "../utils/validation";
import StarredElement from "./StarredItem";

/**
 * @typedef StateProps
 * @property {string} currentPermalink
 * @property {QueryState} query
 * @property {boolean} isOpen
 * @property {StarredItem[]} items
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
            <StarredElement
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

/** @type {import("react-redux").MapStateToProps<StateProps, {}, ExplorerState>} */
function mapStateToProps(state) {
  return {
    currentPermalink: selectPermalink(state),
    isOpen: state.explorerUi.starredDrawer,
    items: state.explorerStarred,
    query: state.explorerQuery
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
