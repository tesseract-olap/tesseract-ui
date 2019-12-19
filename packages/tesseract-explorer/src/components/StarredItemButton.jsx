import {Button, Intent, Tooltip} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {createStarredItem, removeStarredItem} from "../state/starred/actions";
import {selectPermalink} from "../selectors/permalink";

/**
 * @typedef StateProps
 * @property {string} permalink
 */

/**
 * @typedef OwnProps
 * @property {string} className
 * @property {boolean} disabled
 * @property {StarredItem[]} starredItems
 * @property {QueryState} query
 */

/**
 * @typedef DispatchProps
 * @property {(permalink: string, query: QueryState) => any} starQuery
 * @property {(permalink: string) => any} unstarQuery
 */

/** @type {React.FC<StateProps & OwnProps & DispatchProps>} */
const StarredItemButton = function({
  className,
  disabled,
  permalink,
  query,
  starQuery,
  starredItems,
  unstarQuery
}) {
  const isStarred = starredItems.some(item => item.key == permalink);

  const invalidMsg = "This query can't be saved because is invalid";

  return isStarred ? (
    <Tooltip content={disabled ? invalidMsg : "Remove query from starred items"}>
      <Button
        className={className}
        disabled={disabled}
        icon="star"
        intent={Intent.WARNING}
        onClick={() => unstarQuery(permalink)}
      />
    </Tooltip>
  ) : (
    <Tooltip content={disabled ? invalidMsg : "Save query to starred items"}>
      <Button
        className={className}
        disabled={disabled}
        icon="star-empty"
        intent={Intent.NONE}
        onClick={() => starQuery(permalink, query)}
      />
    </Tooltip>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
function mapStateToProps(state) {
  return {
    permalink: selectPermalink(state)
  };
}

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
function mapDispatchToProps(dispatch) {
  return {
    starQuery(permalink, query) {
      return dispatch(createStarredItem(query, permalink));
    },
    unstarQuery(permalink) {
      return dispatch(removeStarredItem(permalink));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StarredItemButton);
