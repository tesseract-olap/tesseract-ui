import React from "react";
import cn from "classnames";
import {FormGroup} from "@blueprintjs/core";

function QueryGroup(props) {
  return (
    <FormGroup
      {...props}
      className={cn("query-group", props.className)}
      labelInfo={undefined}
      label={undefined}
    >
      <details open={props.open}>
        <summary data-label-info={props.labelInfo}>{props.label}</summary>
        {props.children}
      </details>
    </FormGroup>
  );
}

QueryGroup.defaultProps = {
  open: true
};

export default QueryGroup;
