import {Button, Checkbox, Intent, ButtonGroup} from "@blueprintjs/core";
import memoizeOne from "memoize-one";
import React from "react";
import {connect} from "react-redux";
import {fetchMembers, runQuery} from "../actions/client";
import {
  queryCutAdd,
  queryDrilldownAdd,
  queryGrowthClear,
  queryGrowthUpdate,
  queryParentsToggle,
  queryRcaClear,
  queryRcaUpdate,
  querySparseToggle,
  queryTopClear,
  queryTopUpdate
} from "../actions/query";
import {getTopItemsSummary} from "../utils/format";
import {buildCut, buildDrilldown} from "../utils/query";
import {
  activeItemCounter,
  checkCuts,
  checkDrilldowns,
  checkMeasures
} from "../utils/validation";
import GrowthInput from "./GrowthInput";
import QueryGroup from "./QueryGroup";
import RcaInput from "./RcaInput";
import SelectorLevelMulti from "./SelectorLevelMulti";
import StarredItemButton from "./StarredItemButton";
import TagCut from "./TagCut";
import TagDrilldown from "./TagDrilldown";
import TagMeasure from "./TagMeasure";
import TopItemsInput from "./TopItemsInput";

/**
 * @typedef OwnProps
 * @property {string} className
 */

/**
 * @typedef StateProps
 * @property {import("../reducers/queryReducer").QueryState} query
 * @property {boolean} hasTimeDim
 * @property {boolean} optionsOpen
 */

/**
 * @typedef DispatchProps
 * @property {(drillable: import("../reducers/cubesReducer").JSONLevel) => any} addCutHandler
 * @property {(drillable: import("../reducers/cubesReducer").JSONLevel) => any} addDrilldownHandler
 * @property {() => any} clearGrowthHandler
 * @property {() => any} clearRcaHandler
 * @property {() => any} clearTopHandler
 * @property {() => any} executeQuery
 * @property {() => any} toggleParentsHandler
 * @property {() => any} toggleSparseHandler
 * @property {(values: Partial<import("../reducers/queryReducer").GrowthQueryState>) => any} updateGrowthHandler
 * @property {(values: Partial<import("../reducers/queryReducer").RcaQueryState>) => any} updateRcaHandler
 * @property {(values: Partial<import("../reducers/queryReducer").TopQueryState>) => any} updateTopHandler
 */

/** @type {React.FunctionComponent<OwnProps & StateProps & DispatchProps>} */
const QueryPanel = function(props) {
  const {query} = props;

  const ddCheck = checkDrilldowns(query);
  const msCheck = checkMeasures(query);
  const ctCheck = checkCuts(query);
  const allChecks = [].concat(ddCheck, msCheck, ctCheck);

  const ctCount = query.cuts.reduce(activeItemCounter, 0);
  const ddCount = query.drilldowns.reduce(activeItemCounter, 0);
  const msCount = query.measures.reduce(activeItemCounter, 0);

  return (
    <div className={props.className}>
      <QueryGroup
        className="area-drilldowns"
        label="Drilldowns"
        labelInfo={ddCount}
        validation={ddCheck}
      >
        {query.drilldowns.map(item => <TagDrilldown key={item.key} item={item} />)}
        <SelectorLevelMulti
          onItemSelected={props.addDrilldownHandler}
          selectedItems={query.drilldowns}
          text="Add drilldown"
        />
      </QueryGroup>

      <QueryGroup
        className="area-measures"
        label="Measures"
        labelInfo={msCount}
        validation={msCheck}
      >
        {query.measures.map(item => <TagMeasure key={item.key} item={item} />)}
      </QueryGroup>

      <QueryGroup
        className="area-cuts"
        label="Cuts"
        labelInfo={ctCount}
        validation={ctCheck}
      >
        {query.cuts.map(item => <TagCut key={item.key} item={item} />)}
        <SelectorLevelMulti
          onItemSelected={props.addCutHandler}
          selectedItems={query.cuts}
          text="Add cut"
        />
      </QueryGroup>

      {props.hasTimeDim && (
        <QueryGroup
          className="area-growth"
          label="Calculate growth"
          onClear={props.clearGrowthHandler}
          open={false}
        >
          <GrowthInput {...query.growth} onChange={props.updateGrowthHandler} />
        </QueryGroup>
      )}

      <QueryGroup
        className="area-rca"
        label="Calculate RCA"
        onClear={props.clearRcaHandler}
        open={false}
      >
        <RcaInput {...query.rca} onChange={props.updateRcaHandler} />
      </QueryGroup>

      <QueryGroup
        className="area-top"
        label={getTopItemsSummary(query.top) || "Calculate top items"}
        onClear={props.clearTopHandler}
        open={false}
      >
        <TopItemsInput {...query.top} onChange={props.updateTopHandler} />
      </QueryGroup>

      <QueryGroup className="area-options" label="Options">
        <Checkbox
          className="item-option"
          label="Include parent levels"
          checked={query.parents}
          onChange={props.toggleParentsHandler}
        />
        <Checkbox
          className="item-option"
          label="Optimize sparse results"
          checked={query.sparse}
          onChange={props.toggleSparseHandler}
        />
      </QueryGroup>

      <ButtonGroup fill={true}>
        <Button
          className="action-query"
          text="Execute query"
          icon="database"
          disabled={allChecks.length > 0}
          intent={Intent.PRIMARY}
          fill={true}
          onClick={props.executeQuery}
        />
        <StarredItemButton className="action-star" disabled={allChecks.length > 0} />
      </ButtonGroup>
    </div>
  );
};

/** @type {(dimensions: any[]) => boolean} */
const hasTimeDim = memoizeOne(dimensions => dimensions.some(dim => dim.type === "time"));

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  const query = state.explorerQuery;
  const cube = state.explorerCubes[query.cube];
  return {
    query,
    hasTimeDim: cube && hasTimeDim(cube.dimensions),
    optionsOpen: state.explorerUi.queryOptions
  };
}

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
function mapDispatchToProps(dispatch) {
  return {
    addCutHandler(level) {
      const cutItem = buildCut(level);
      dispatch(queryCutAdd(cutItem));
      return dispatch(fetchMembers(cutItem));
    },
    addDrilldownHandler(drillable) {
      const drilldownItem = buildDrilldown(drillable);
      return dispatch(queryDrilldownAdd(drilldownItem));
    },
    clearGrowthHandler() {
      return dispatch(queryGrowthClear());
    },
    clearRcaHandler() {
      return dispatch(queryRcaClear());
    },
    clearTopHandler() {
      return dispatch(queryTopClear());
    },
    executeQuery() {
      return dispatch(runQuery());
    },
    toggleParentsHandler() {
      return dispatch(queryParentsToggle());
    },
    toggleSparseHandler() {
      return dispatch(querySparseToggle());
    },
    updateGrowthHandler(values) {
      return dispatch(queryGrowthUpdate(values));
    },
    updateRcaHandler(values) {
      return dispatch(queryRcaUpdate(values));
    },
    updateTopHandler(values) {
      return dispatch(queryTopUpdate(values));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryPanel);
