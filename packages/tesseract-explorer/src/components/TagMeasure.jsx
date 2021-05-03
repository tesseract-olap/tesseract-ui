import {Checkbox} from "@blueprintjs/core";
import React from "react";

/**
 * @typedef OwnProps
 * @property {TessExpl.Struct.MeasureItem} item
 * @property {(item: TessExpl.Struct.MeasureItem) => void} onToggle
 */

/** @type {React.FC<OwnProps>} */
function TagMeasure(props) {
  const {item} = props;
  return (
    <Checkbox
      className="item-measure"
      label={item.measure}
      checked={item.active}
      onChange={() => props.onToggle(item)}
    />
  );
}

export default TagMeasure;
