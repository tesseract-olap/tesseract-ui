import {Checkbox} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {queryMeasureToggle} from "../actions/query";

function TagMeasure(props) {
  const item = props.item;
  return (
    <Checkbox
      className="item-measure"
      label={item.measure}
      checked={item.active}
      onChange={props.changeHandler}
    />
  );
}

function mapDispatchToProps(dispatch, props) {
  return {
    changeHandler() {
      return dispatch(queryMeasureToggle(props.item));
    }
  };
}

export default connect(null, mapDispatchToProps)(TagMeasure);
