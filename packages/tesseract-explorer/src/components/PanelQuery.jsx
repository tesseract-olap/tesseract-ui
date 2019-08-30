import {Button, ButtonGroup, Checkbox, Intent} from "@blueprintjs/core";
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
  queryTopkClear,
  queryTopkUpdate
} from "../actions/query";
import {summaryGrowth, summaryRca, summaryTopk} from "../utils/format";
import {buildCut, buildDrilldown} from "../utils/query";
import {
  activeItemCounter,
  checkCuts,
  checkDrilldowns,
  checkMeasures
} from "../utils/validation";
import InputGrowth from "./InputGrowth";
import InputRCA from "./InputRCA";
import InputTopK from "./InputTopK";
import QueryGroup from "./QueryGroup";
import TagCut from "./QueryTagCut";
import TagDrilldown from "./QueryTagDrilldown";
import TagMeasure from "./QueryTagMeasure";
import SelectorLevelMulti from "./SelectorLevelMulti";
import StarredItemButton from "./StarredItemButton";

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
 * @property {() => any} clearTopkHandler
 * @property {() => any} executeQuery
 * @property {() => any} toggleParentsHandler
 * @property {() => any} toggleSparseHandler
 * @property {(values: import("../reducers").GrowthQueryState) => any} updateGrowthHandler
 * @property {(values: import("../reducers").RcaQueryState) => any} updateRcaHandler
 * @property {(values: import("../reducers").TopkQueryState) => any} updateTopkHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
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
          label={summaryGrowth(query.growth) || "Calculate growth"}
          onClear={props.clearGrowthHandler}
          open={false}
        >
          <InputGrowth {...query.growth} onChange={props.updateGrowthHandler} />
        </QueryGroup>
      )}

      <QueryGroup
        className="area-rca"
        label={summaryRca(query.rca) || "Calculate RCA"}
        onClear={props.clearRcaHandler}
        open={false}
      >
        <InputRCA {...query.rca} onChange={props.updateRcaHandler} />
      </QueryGroup>

      <QueryGroup
        className="area-topk"
        label={summaryTopk(query.topk) || "Calculate Top K"}
        onClear={props.clearTopkHandler}
        open={false}
      >
        <InputTopK {...query.topk} onChange={props.updateTopkHandler} />
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
        <StarredItemButton
          query={query}
          className="action-star"
          disabled={allChecks.length > 0}
        />
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
    clearTopkHandler() {
      return dispatch(queryTopkClear());
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
    updateTopkHandler(values) {
      return dispatch(queryTopkUpdate(values));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryPanel);
