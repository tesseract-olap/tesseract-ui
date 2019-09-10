import {ControlGroup} from "@blueprintjs/core";
import React, {memo} from "react";
import {stringifyName} from "../utils/transform";
import {shallowEqualExceptFns} from "../utils/validation";
import SelectorLevelMono from "./SelectorLevelMono";
import SelectorMeasure from "./SelectorMeasure";

/**
 * @typedef OwnProps
 * @property {(value: Partial<import("../reducers").RcaQueryState>) => any} onChange
 */

/**
 * @type {React.FC<import("../reducers").RcaQueryState & OwnProps>}
 */
const InputRCA = function({level1, level2, measure, onChange}) {
  return (
    <ControlGroup className="rca-input" vertical={true}>
      <SelectorLevelMono
        selectedItem={level1}
        fill={true}
        icon="layer"
        onItemSelect={level => onChange({level1: stringifyName(level)})}
      />
      <SelectorLevelMono
        selectedItem={level2}
        fill={true}
        icon="layer"
        onItemSelect={level => onChange({level2: stringifyName(level)})}
      />
      <SelectorMeasure
        selectedItem={measure}
        fill={true}
        icon="th-list"
        onItemSelect={measure => onChange({measure})}
      />
    </ControlGroup>
  );
};

export default memo(InputRCA, shallowEqualExceptFns);
