import {Button} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";

import {STARRED_ADD, STARRED_REMOVE} from "../actions/starred";
import {serializeState} from "../utils/format";

function StarredItemButton(props) {
  const serializedQuery = props.cube && serializeState(props.query);
  const queryHash = JSON.stringify(serializedQuery);
  const isStarred = queryHash in props.index;
  const toggleStarredState = isStarred ? props.unstarQuery : props.starQuery;
  return (
    <Button
      className="action-star"
      text={isStarred ? "Remove from saved" : "Save this query"}
      icon={isStarred ? "star-empty" : "star"}
      fill={true}
      onClick={toggleStarredState.bind(this, serializedQuery, queryHash)}
    />
  );
}

/** @param {import("../reducers").ExplorerState} state */
function mapStateToProps(state) {
  return {
    cube: state.explorerCubes.current,
    index: state.explorerStarred.index,
    query: state.explorerQuery
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    starQuery(query, hash) {
      const date = new Date().toISOString();
      return dispatch({type: STARRED_ADD, payload: {date, hash, query}});
    },
    unstarQuery(query, hash) {
      const date = new Date().toISOString();
      return dispatch({type: STARRED_REMOVE, payload: {date, hash, query}});
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StarredItemButton);
