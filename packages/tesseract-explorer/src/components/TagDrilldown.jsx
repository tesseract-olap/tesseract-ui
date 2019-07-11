import {Tag} from "@blueprintjs/core";
import cn from "classnames";
import React from "react";
import {connect} from "react-redux";
import {queryDrilldownRemove, queryDrilldownUpdate} from "../actions/query";
import {abbreviateFullName} from "../utils/format";

function TagDrilldown(props) {
  const {item} = props;
  const label = abbreviateFullName(item.drillable);
  return (
    <Tag
      className={cn("item-drilldown", {hidden: !item.active})}
      fill={true}
      icon="layer"
      interactive={true}
      large={true}
      onClick={props.toggleHandler}
      onRemove={props.removeHandler}
    >
      {label}
    </Tag>
  );
}

function mapDispatchToProps(dispatch, props) {
  return {
    toggleHandler() {
      const item = props.item;
      return dispatch(queryDrilldownUpdate({...item, active: !item.active}));
    },
    removeHandler(evt) {
      evt.stopPropagation();
      return dispatch(queryDrilldownRemove(props.item));
    }
  };
}

export default connect(null, mapDispatchToProps)(TagDrilldown);
