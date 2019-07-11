import {FormGroup, Intent, Button} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";

function QueryGroup(props) {
  const issues = props.validation || [];

  return (
    <FormGroup
      helperText={issues.join("\n")}
      intent={issues.length > 0 ? Intent.DANGER : undefined}
      {...props}
      className={classNames("query-group", props.className)}
      labelInfo={undefined}
      label={undefined}
    >
      <details open={props.open}>
        <summary className="details-title" data-label-info={props.labelInfo}>
          {props.onClear && (
            <Button minimal={true} icon="delete" title="Clear" small={true} onClick={props.onClear} />
          )}
          <span>{props.label}</span>
        </summary>
        <div className="details-content">{props.children}</div>
      </details>
    </FormGroup>
  );
}

QueryGroup.defaultProps = {
  open: true
};

export default QueryGroup;
