import {Checkbox} from "@blueprintjs/core";
import React from "react";

/**
 * @typedef OwnProps
 * @property {TessExpl.Struct.MeasureItem} item
 * @property {(event: React.FormEvent<HTMLInputElement>) => void} [onToggle]
 */

/** @type {React.FC<OwnProps>} */
function TagMeasure(props) {
  const {item} = props;
  return (
    <Checkbox
      className="item-measure"
      label={item.measure}
      checked={item.active}
      onChange={props.onToggle}
    />
  );
}

export default TagMeasure;
