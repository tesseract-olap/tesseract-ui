import {Button, Intent, Tooltip} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {createStarredItem, removeStarredItem} from "../actions/starred";

/**
 * @typedef OwnProps
 * @property {string} className
 * @property {boolean} disabled
 * @property {import("../reducers/queryReducer").QueryState} query
 */

/**
 * @typedef StateProps
 * @property {boolean} isStarred
 */

/**
 * @typedef DispatchProps
 * @property {() => any} starQuery
 * @property {() => any} unstarQuery
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const StarredItemButton = function(props) {
  const {isStarred, disabled} = props;

  const invalidMsg = "This query can't be saved because is invalid";

  return isStarred ? (
    <Tooltip content={disabled ? invalidMsg : "Remove query from starred items"}>
      <Button
        className={props.className}
        disabled={disabled}
        icon="star"
        intent={Intent.WARNING}
        onClick={props.unstarQuery}
      />
    </Tooltip>
  ) : (
    <Tooltip content={disabled ? invalidMsg : "Save query to starred items"}>
      <Button
        className={props.className}
        disabled={disabled}
        icon="star-empty"
        intent={Intent.NONE}
        onClick={props.starQuery}
      />
    </Tooltip>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, {}, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  const {permalink} = state.explorerQuery;
  return {
    isStarred: state.explorerStarred.some(item => item.key == permalink)
  };
}

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
function mapDispatchToProps(dispatch, props) {
  return {
    starQuery() {
      return dispatch(createStarredItem(props.query));
    },
    unstarQuery() {
      return dispatch(removeStarredItem(props.query.permalink));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StarredItemButton);
