import {Button, ButtonGroup, Intent} from "@blueprintjs/core";
import React, {memo} from "react";
import {connect} from "react-redux";
import {fetchMembers, runQuery} from "../actions/client";
import {
  queryCutAdd,
  queryDrilldownAdd,
  queryGrowthClear,
  queryGrowthUpdate,
  queryRcaClear,
  queryRcaUpdate,
  queryTopkClear,
  queryTopkUpdate
} from "../actions/query";
import {selectTimeDimension} from "../selectors/cubes";
import {summaryGrowth, summaryRca, summaryTopk} from "../utils/format";
import {buildCut, buildDrilldown} from "../utils/query";
import {
  activeItemCounter,
  checkCuts,
  checkDrilldowns,
  checkMeasures,
  shallowEqualExceptFns
} from "../utils/validation";
import InputGrowth from "./InputGrowth";
import InputRCA from "./InputRCA";
import InputTopK from "./InputTopK";
import QueryGroup from "./QueryGroup";
import QueryGroupOptions from "./QueryGroupOptions";
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
 * @property {import("../reducers").QueryState} query
 * @property {import("../reducers").StarredItem[]} starredItems
 * @property {boolean} hasTimeDim
 */

/**
 * @typedef DispatchProps
 * @property {(drillable: import("../reducers").JSONLevel) => any} addCutHandler
 * @property {(drillable: import("../reducers").JSONLevel) => any} addDrilldownHandler
 * @property {() => any} clearGrowthHandler
 * @property {() => any} clearRcaHandler
 * @property {() => any} clearTopkHandler
 * @property {() => any} executeQuery
 * @property {(values: import("../reducers").GrowthQueryState) => any} updateGrowthHandler
 * @property {(values: import("../reducers").RcaQueryState) => any} updateRcaHandler
 * @property {(values: import("../reducers").TopkQueryState) => any} updateTopkHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const PanelQuery = function(props) {
  const {query, starredItems} = props;

  const ddCheck = checkDrilldowns(query);
  const msCheck = checkMeasures(query);
  const ctCheck = checkCuts(query);
  const allChecks = [...ddCheck, ...msCheck, ...ctCheck];

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

      <QueryGroupOptions />

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
          starredItems={starredItems}
          className="action-star"
          disabled={allChecks.length > 0}
        />
      </ButtonGroup>
    </div>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  return {
    hasTimeDim: Boolean(selectTimeDimension(state)),
    query: state.explorerQuery,
    starredItems: state.explorerStarred
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
    clearGrowthHandler: () => dispatch(queryGrowthClear()),
    clearRcaHandler: () => dispatch(queryRcaClear()),
    clearTopkHandler: () => dispatch(queryTopkClear()),
    executeQuery: () => dispatch(runQuery()),
    updateGrowthHandler: values => dispatch(queryGrowthUpdate(values)),
    updateRcaHandler: values => dispatch(queryRcaUpdate(values)),
    updateTopkHandler: values => dispatch(queryTopkUpdate(values))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  memo(PanelQuery, shallowEqualExceptFns)
);
