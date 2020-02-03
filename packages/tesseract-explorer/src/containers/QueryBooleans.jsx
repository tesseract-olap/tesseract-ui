import {Checkbox} from "@blueprintjs/core";
import React, {memo} from "react";
import {connect} from "react-redux";
import QueryArea from "../components/QueryArea";
import {doBooleanToggle} from "../state/params/actions";
import {selectBooleans} from "../state/params/selectors";
import {shallowEqualExceptFns} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {boolean} [debug]
 * @property {boolean} [distinct]
 * @property {boolean} [nonempty]
 * @property {boolean} [parents]
 * @property {boolean} [sparse]
 */

/**
 * @typedef DispatchProps
 * @property {() => any} toggleDebugHandler
 * @property {() => any} toggleDistinctHandler
 * @property {() => any} toggleNonEmptyHandler
 * @property {() => any} toggleParentsHandler
 * @property {() => any} toggleSparseHandler
 */

const QueryBooleans = props =>
  <QueryArea className={props.className} title="Booleans" open={false}>
    <Checkbox
      className="item-option"
      label="Debug MDX"
      checked={props.debug || false}
      onChange={props.toggleDebugHandler}
    />
    <Checkbox
      className="item-option"
      label="Apply DISTINCT"
      checked={props.distinct || false}
      onChange={props.toggleDistinctHandler}
    />
    <Checkbox
      className="item-option"
      label="Only return non-empty data"
      checked={props.nonempty || false}
      onChange={props.toggleNonEmptyHandler}
    />
    <Checkbox
      className="item-option"
      label="Include parent levels"
      checked={props.parents || false}
      onChange={props.toggleParentsHandler}
    />
    <Checkbox
      className="item-option"
      label="Optimize sparse results"
      checked={props.sparse || false}
      onChange={props.toggleSparseHandler}
    />
  </QueryArea>;

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = selectBooleans;

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  toggleDebugHandler() {
    dispatch(doBooleanToggle("debug"));
  },
  toggleDistinctHandler() {
    dispatch(doBooleanToggle("distinct"));
  },
  toggleNonEmptyHandler() {
    dispatch(doBooleanToggle("nonempty"));
  },
  toggleParentsHandler() {
    dispatch(doBooleanToggle("parents"));
  },
  toggleSparseHandler() {
    dispatch(doBooleanToggle("sparse"));
  }
});

export default connect(mapState, mapDispatch)(memo(QueryBooleans, shallowEqualExceptFns));
