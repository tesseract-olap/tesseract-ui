import {Checkbox} from "@blueprintjs/core";
import React, {memo} from "react";
import {connect} from "react-redux";
import QueryArea from "../components/QueryArea";
import {doBooleanToggle} from "../state/params/actions";
import {selectServerBooleansEnabled} from "../state/server/selectors";
import {shallowEqualExceptFns} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {boolean} [debug]
 * @property {boolean} [distinct]
 * @property {boolean} [exclude_default_members]
 * @property {boolean} [nonempty]
 * @property {boolean} [parents]
 * @property {boolean} [sparse]
 * @property {string[]} _enabledBooleans
 */

/**
 * @typedef DispatchProps
 * @property {() => any} toggleDebugHandler
 * @property {() => any} toggleDistinctHandler
 * @property {() => any} toggleExcludeDefaultMembersHandler
 * @property {() => any} toggleNonEmptyHandler
 * @property {() => any} toggleParentsHandler
 * @property {() => any} toggleSparseHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
export const QueryBooleans = props =>
  <QueryArea className={props.className} title="Query options" open={false}>
    {props._enabledBooleans.includes("debug") && <Checkbox
      className="item-option"
      label="Debug MDX"
      checked={props.debug || false}
      onChange={props.toggleDebugHandler}
    />}
    {props._enabledBooleans.includes("distinct") && <Checkbox
      className="item-option"
      label="Apply DISTINCT to drilldowns"
      checked={props.distinct || false}
      onChange={props.toggleDistinctHandler}
    />}
    {props._enabledBooleans.includes("exclude_default_members") && <Checkbox
      className="item-option"
      label="Exclude default members"
      checked={props.exclude_default_members || false}
      onChange={props.toggleExcludeDefaultMembersHandler}
    />}
    {props._enabledBooleans.includes("nonempty") && <Checkbox
      className="item-option"
      label="Only return non-empty data"
      checked={props.nonempty || false}
      onChange={props.toggleNonEmptyHandler}
    />}
    {props._enabledBooleans.includes("parents") && <Checkbox
      className="item-option"
      label="Include parent levels"
      checked={props.parents || false}
      onChange={props.toggleParentsHandler}
    />}
    {props._enabledBooleans.includes("sparse") && <Checkbox
      className="item-option"
      label="Optimize sparse results"
      checked={props.sparse || false}
      onChange={props.toggleSparseHandler}
    />}
  </QueryArea>;

export const MemoQueryBooleans = memo(QueryBooleans, shallowEqualExceptFns);

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  ...selectBooleans(state),
  _enabledBooleans: selectServerBooleansEnabled(state)
});

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  toggleDebugHandler() {
    dispatch(doBooleanToggle("debug"));
  },
  toggleDistinctHandler() {
    dispatch(doBooleanToggle("distinct"));
  },
  toggleExcludeDefaultMembersHandler() {
    dispatch(doBooleanToggle("exclude_default_members"));
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

export const ConnectedQueryBooleans = connect(mapState, mapDispatch)(MemoQueryBooleans);
