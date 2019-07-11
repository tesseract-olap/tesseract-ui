import {Button, Intent, Tooltip} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {createStarredItem, removeStarredItem} from "../actions/starred";
import {serializePermalink} from "../utils/format";
import {isValidQuery} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {string} className
 * @property {boolean} disabled
 */

/**
 * @typedef StateProps
 * @property {string} hash
 * @property {boolean} isStarred
 * @property {import("../reducers/queryReducer").QueryState} query
 */

/**
 * @typedef DispatchProps
 * @property {(query: import("../reducers/queryReducer").QueryState, hash: string) => any} starQuery
 * @property {(query: import("../reducers/queryReducer").QueryState, hash: string) => any} unstarQuery
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const StarredItemButton = function(props) {
  const {query, hash, isStarred, disabled} = props;

  const invalidMsg = "This query can't be saved because is invalid";

  return isStarred ? (
    <Tooltip content={disabled ? invalidMsg : "Remove query from starred items"}>
      <Button
        className={props.className}
        disabled={disabled}
        icon="star"
        intent={Intent.WARNING}
        onClick={props.unstarQuery.bind(null, query, hash)}
      />
    </Tooltip>
  ) : (
    <Tooltip content={disabled ? invalidMsg : "Save query to starred items"}>
      <Button
        className={props.className}
        disabled={disabled}
        icon="star-empty"
        intent={Intent.NONE}
        onClick={props.starQuery.bind(null, query, hash)}
      />
    </Tooltip>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, {}, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  const query = state.explorerQuery;
  const permalink = serializePermalink(query);
  return {
    hash: permalink,
    isStarred: state.explorerStarred.some(item => item.key == permalink),
    query
  };
}

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, {}>} */
function mapDispatchToProps(dispatch) {
  return {
    starQuery(query, hash) {
      return dispatch(createStarredItem(query, hash));
    },
    unstarQuery(_, hash) {
      return dispatch(removeStarredItem(hash));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StarredItemButton);
