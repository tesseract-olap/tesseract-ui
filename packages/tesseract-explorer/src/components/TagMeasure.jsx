import {Checkbox, Switch} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";

import {QUERY_MEASURES_UPDATE} from "../actions/query";

function TagMeasure(props) {
  return (
    <Switch
      className="item-measure"
      label={props.measure.name}
      checked={props.active}
      onChange={props.changeHandler}
    />
  );
}

function mapDispatchToProps(dispatch, props) {
  return {
    changeHandler(evt) {
      const measure = props.measure;
      const payload = {key: measure.name, measure, active: evt.target.checked};
      return dispatch({type: QUERY_MEASURES_UPDATE, payload});
    }
  };
}

export default connect(null, mapDispatchToProps)(TagMeasure);
