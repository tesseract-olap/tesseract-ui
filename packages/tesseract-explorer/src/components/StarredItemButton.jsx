import {Button, Intent, Tooltip} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {createStarredItem, removeStarredItem} from "../actions/starred";
import {serializePermalink} from "../utils/permalink";

/**
 * @typedef OwnProps
 * @property {string} className
 * @property {boolean} disabled
 * @property {import("../reducers").StarredItem[]} starredItems
 * @property {import("../reducers").QueryState} query
 */

/**
 * @typedef DispatchProps
 * @property {() => any} starQuery
 * @property {() => any} unstarQuery
 */

/** @type {React.FC<OwnProps & DispatchProps>} */
const StarredItemButton = function(props) {
  const {query, starredItems, disabled} = props;
  const permalink = serializePermalink(query);
  const isStarred = starredItems.some(item => item.key == permalink);

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

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
function mapDispatchToProps(dispatch, props) {
  return {
    starQuery() {
      return dispatch(createStarredItem(props.query));
    },
    unstarQuery() {
      const permalink = serializePermalink(props.query);
      return dispatch(removeStarredItem(permalink));
    }
  };
}

export default connect(null, mapDispatchToProps)(StarredItemButton);
