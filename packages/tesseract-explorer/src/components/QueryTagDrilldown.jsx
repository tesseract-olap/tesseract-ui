import {Tag} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import {connect} from "react-redux";
import {queryDrilldownRemove, queryDrilldownUpdate} from "../state/query/actions";
import {abbreviateFullName} from "../utils/format";
import {levelRefToArray} from "../utils/transform";

/**
 * @typedef OwnProps
 * @property {DrilldownItem} item
 */

/**
 * @typedef DispatchProps
 * @property {() => any} toggleHandler
 * @property {(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any} removeHandler
 */

/** @type {React.FC<OwnProps & DispatchProps>} */
const TagDrilldown = function({item, removeHandler, toggleHandler}) {
  const {active} = item;
  const label = abbreviateFullName(levelRefToArray(item));
  return (
    <Tag
      className={classNames("item-drilldown", {hidden: !active})}
      fill={true}
      icon="layer"
      interactive={true}
      large={true}
      onClick={toggleHandler}
      onRemove={removeHandler}
    >
      {label}
    </Tag>
  );
};

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
