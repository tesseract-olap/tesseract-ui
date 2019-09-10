import {Alignment, Button, ControlGroup, Popover, Position} from "@blueprintjs/core";
import React, {memo} from "react";
import {ensureArray} from "../utils/array";
import {stringifyName} from "../utils/transform";
import {shallowEqualExceptFns} from "../utils/validation";
import TimeDimensionMenu from "./MenuDimensionTime";
import SelectorMeasure from "./SelectorMeasure";

/**
 * @typedef OwnProps
 * @property {(value: Partial<import("../reducers").GrowthQueryState>) => any} onChange
 */

/**
 * @type {React.FC<import("../reducers").GrowthQueryState & OwnProps>}
 */
const InputGrowth = function({level, measure, onChange}) {
  return (
    <ControlGroup className="growth-input" vertical={true}>
      <SelectorMeasure
        selectedItem={measure}
        fill={true}
        icon="th-list"
        onItemSelect={measure => onChange({measure})}
      />
      <Popover
        autoFocus={false}
        boundary="viewport"
        minimal={true}
        position={Position.BOTTOM_LEFT}
        targetTagName="div"
        wrapperTagName="div"
      >
        <Button
          alignText={Alignment.LEFT}
          fill={true}
          icon="calendar"
          rightIcon="double-caret-vertical"
          text={level || "Time level..."}
        />
        <TimeDimensionMenu
          selectedItems={ensureArray(level)}
          onClick={level => onChange({level: stringifyName(level)})}
        />
      </Popover>
    </ControlGroup>
  );
};

export default memo(InputGrowth, shallowEqualExceptFns);
