import {Tag} from "@blueprintjs/core";
import cn from "classnames";
import React from "react";
import {connect} from "react-redux";

import {QUERY_DRILLDOWNS_REMOVE, QUERY_DRILLDOWNS_UPDATE} from "../actions/query";

function TagDrilldown(props) {
  const drillable = props.drillable;
  return (
    <Tag
      className={cn("item-drilldown", {hidden: !props.active})}
      fill={true}
      icon="layer"
      interactive={true}
      large={true}
      onClick={props.toggleHandler}
      onRemove={props.removeHandler}
    >
      {drillable.fullName}
    </Tag>
  );
}

function mapDispatchToProps(dispatch, props) {
  return {
    toggleHandler() {
      const drillable = props.drillable;
      const payload = {key: drillable.fullName, drillable, active: !props.active};
      return dispatch({type: QUERY_DRILLDOWNS_UPDATE, payload});
    },
    removeHandler(evt) {
      evt.stopPropagation();
      return dispatch({type: QUERY_DRILLDOWNS_REMOVE, payload: props.drillable});
    }
  };
}

export default connect(null, mapDispatchToProps)(TagDrilldown);
