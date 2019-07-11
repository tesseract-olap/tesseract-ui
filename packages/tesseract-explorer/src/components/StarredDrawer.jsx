import {Button, ButtonGroup, Classes, Divider, Drawer, Intent} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {connect} from "react-redux";
import {queryInyect} from "../actions/query";
import {removeStarredItem} from "../actions/starred";
import {toggleStarredDrawer} from "../actions/ui";
import "../style/starredDrawer.scss";
import JsonRenderer from "./JsonRenderer";

/**
 * @typedef StateProps
 * @property {boolean} isOpen
 * @property {import("../reducers").StarredItem[]} items
 */

/**
 * @typedef DispatchProps
 * @property {() => any} closeDrawerHandler
 * @property {(query: import("../reducers/queryReducer").QueryState) => any} loadStarredQuery
 * @property {(key: string) => any} removeStarredItem
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
            <div
              key={item.key}
              className={classNames("starred-drawer-item", Classes.CARD)}
            >
              <ButtonGroup className="item-header" fill={true} minimal={true}>
                <span className={Classes.FILL}>{item.date}</span>
                <Button
                  icon="import"
                  text="Load"
                  onClick={props.loadStarredQuery.bind(null, item.query)}
                />
                <Divider />
                <Button
                  icon="trash"
                  text="Remove"
                  intent={Intent.DANGER}
                  onClick={props.removeStarredItem.bind(null, item.key)}
                />
              </ButtonGroup>
              {Object.keys(item.query).map(key => (
                <JsonRenderer key={key} name={key} value={item.query[key]} />
              ))}
            </div>
          ))}
        </div>
      </PerfectScrollbar>
    </Drawer>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, {}, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  return {
    isOpen: state.explorerUi.starredDrawer,
    items: state.explorerStarred
  };
}

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, {}>} */
function mapDispatchToProps(dispatch) {
  return {
    closeDrawerHandler() {
      return dispatch(toggleStarredDrawer(false));
    },
    loadStarredQuery(query) {
      return dispatch(queryInyect(query));
    },
    removeStarredItem(key) {
      return dispatch(removeStarredItem(key));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StarredDrawer);
