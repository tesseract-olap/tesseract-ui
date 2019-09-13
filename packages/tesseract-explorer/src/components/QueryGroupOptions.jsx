import {Checkbox} from "@blueprintjs/core";
import React, {memo} from "react";
import {connect} from "react-redux";
import {
  queryDebugToggle,
  queryDistinctToggle,
  queryNonEmptyToggle,
  queryParentsToggle,
  querySparseToggle
} from "../actions/query";
import {shallowEqualExceptFns} from "../utils/validation";
import QueryGroup from "./QueryGroup";

/**
 * @typedef StateProps
 * @property {import("../reducers").QueryState} query
 */

/**
 * @typedef DispatchProps
 * @property {() => any} toggleDebugHandler
 * @property {() => any} toggleDistinctHandler
 * @property {() => any} toggleNonEmptyHandler
 * @property {() => any} toggleParentsHandler
 * @property {() => any} toggleSparseHandler
 */

const QueryGroupOptions = function({
  query,
  toggleDebugHandler,
  toggleDistinctHandler,
  toggleNonEmptyHandler,
  toggleParentsHandler,
  toggleSparseHandler
}) {
  return (
    <QueryGroup className="area-options" label="Options">
      <Checkbox
        className="item-option"
        label="Debug MDX"
        checked={query.debug}
        onChange={toggleDebugHandler}
      />
      <Checkbox
        className="item-option"
        label="Apply DISTINCT"
        checked={query.distinct}
        onChange={toggleDistinctHandler}
      />
      <Checkbox
        className="item-option"
        label="Only return non-empty data"
        checked={query.nonempty}
        onChange={toggleNonEmptyHandler}
      />
      <Checkbox
        className="item-option"
        label="Include parent levels"
        checked={query.parents}
        onChange={toggleParentsHandler}
      />
      <Checkbox
        className="item-option"
        label="Optimize sparse results"
        checked={query.sparse}
        onChange={toggleSparseHandler}
      />
    </QueryGroup>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, {}, import("../reducers").ExplorerState>}*/
function mapStateToProps(state) {
  return {
    query: state.explorerQuery
  };
}

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, {}>} */
function mapDispatchToProps(dispatch) {
  return {
    toggleDebugHandler: () => dispatch(queryDebugToggle()),
    toggleDistinctHandler: () => dispatch(queryDistinctToggle()),
    toggleNonEmptyHandler: () => dispatch(queryNonEmptyToggle()),
    toggleParentsHandler: () => dispatch(queryParentsToggle()),
    toggleSparseHandler: () => dispatch(querySparseToggle())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  memo(QueryGroupOptions, shallowEqualExceptFns)
);
