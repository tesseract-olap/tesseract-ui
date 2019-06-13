import {Button, Checkbox, Intent, Popover} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";

import {
  QUERY_DRILLDOWNS_ADD,
  QUERY_PARENTS_TOGGLE,
  QUERY_GROWTH_UPDATE,
  QUERY_RCA_UPDATE,
  QUERY_TOPN_UPDATE
} from "../actions/query";
import {addCutAndFetchMembers, executeQuery, applyQueryParams} from "../utils/api";
import {checkDrilldowns, checkMeasures} from "../utils/validation";
import DimensionsMenu from "./MenuDimensions";
import QueryGroup from "./QueryGroup";
import TagCut from "./TagCut";
import TagDrilldown from "./TagDrilldown";
import TagMeasure from "./TagMeasure";
import GrowthInput from "./GrowthInput";
import RcaInput from "./RcaInput";
import {countActive} from "../utils/array";
import TopItemsInput from "./TopItemsInput";
import { getTopItemsSummary } from "../utils/format";

function QueryPanel(props) {
  const drilldownCheck = checkDrilldowns(props);
  const measureCheck = checkMeasures(props);

  const topItemsLabel = getTopItemsSummary(props.top) || "Calculate top items";

  return (
    <div className={props.className}>
      <QueryGroup
        labelInfo={props.activeDdn}
        className="area-drilldowns"
        helperText={drilldownCheck.join("\n")}
        intent={drilldownCheck.length > 0 ? Intent.DANGER : undefined}
        label="Drilldowns"
      >
        {props.drilldowns.map(item => <TagDrilldown {...item} />)}
        <Popover targetTagName="div">
          <Button
            className="action-add"
            fill={true}
            icon="insert"
            small={true}
            text="Add drilldown"
          />
          <DimensionsMenu
            activeItems={props.drilldowns}
            onClick={props.drilldownAddHandler}
          />
        </Popover>
      </QueryGroup>

      <QueryGroup
        labelInfo={props.activeMsr}
        className="area-measures"
        helperText={measureCheck.join("\n")}
        intent={measureCheck.length > 0 ? Intent.DANGER : undefined}
        label="Measures"
      >
        {props.measures.map(item => <TagMeasure {...item} />)}
      </QueryGroup>

      <QueryGroup labelInfo={props.activeCut} className="area-cuts" label="Cuts">
        {props.cuts.map(item => <TagCut {...item} />)}
        <Popover targetTagName="div">
          <Button
            className="action-add"
            fill={true}
            icon="insert"
            small={true}
            text="Add cut"
          />
          <DimensionsMenu activeItems={props.cuts} onClick={props.cutAddHandler} />
        </Popover>
      </QueryGroup>

      <QueryGroup className="area-growth" label="Calculate growth" open={false}>
        <GrowthInput cube={props.cube} onChange={props.growthSetHandler} />
      </QueryGroup>

      <QueryGroup className="area-rca" label="Calculate RCA" open={!false}>
        <RcaInput cube={props.cube} onChange={props.rcaSetHandler} />
      </QueryGroup>

      <QueryGroup className="area-top" label={topItemsLabel} open={!false}>
        <TopItemsInput cube={props.cube} onChange={props.topSetHandler} />
      </QueryGroup>

      <QueryGroup className="area-options" label="Options">
        <Checkbox
          className="item-option"
          label="Include parent levels"
          checked={props.parents}
          onChange={props.parentsToggleHandler}
        />
      </QueryGroup>

      <Button
        className="action-query"
        text="Execute query"
        icon="database"
        disabled={drilldownCheck.length + measureCheck.length > 0}
        intent={Intent.PRIMARY}
        fill={true}
        onClick={() => props.executeQuery(props)}
      />
    </div>
  );
}

function mapStateToProps(state) {
  const query = state.explorerQuery;
  return {
    ...query,
    activeDdn: query.drilldowns.reduce(countActive, 0),
    activeMsr: query.measures.reduce(countActive, 0),
    activeCut: query.cuts.reduce(countActive, 0),
    cube: state.explorerCubes.current,
    optionsOpen: state.explorerUi.queryOptions
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cutAddHandler(drillable) {
      const payload = {key: drillable.fullName, drillable, members: [], active: true};
      return addCutAndFetchMembers(dispatch, payload);
    },
    drilldownAddHandler(drillable) {
      const payload = {key: drillable.fullName, drillable, active: true};
      return dispatch({type: QUERY_DRILLDOWNS_ADD, payload});
    },
    executeQuery(props) {
      const query = props.cube.query;
      applyQueryParams(query, props);
      return executeQuery(dispatch, query);
    },
    growthSetHandler(level, measure) {
      return dispatch({type: QUERY_GROWTH_UPDATE, payload: {level, measure}});
    },
    parentsToggleHandler() {
      return dispatch({type: QUERY_PARENTS_TOGGLE});
    },
    rcaSetHandler(level1, level2, measure) {
      return dispatch({type: QUERY_RCA_UPDATE, payload: {level1, level2, measure}});
    },
    topSetHandler(amount, level, measure, descendent) {
      const payload = {amount, level, measure, descendent};
      return dispatch({type: QUERY_TOPN_UPDATE, payload});
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryPanel);
