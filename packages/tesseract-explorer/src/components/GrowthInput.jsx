import {Alignment, Button, ControlGroup, Popover, Position} from "@blueprintjs/core";
import React from "react";

import TimeDimensionMenu from "./MenuDimensionTime";
import SelectorMeasure from "./SelectorMeasure";

function GrowthInput(props) {
  const {level = undefined, measure = undefined} = props.growth || {};
  return (
    <ControlGroup className="growth-input" vertical={true}>
      <SelectorMeasure
        selectedItem={measure}
        fill={true}
        icon="th-list"
        onItemSelect={measure => props.onChange({measure})}
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
          selectedItems={level}
          onClick={level => props.onChange({level})}
        />
      </Popover>
    </ControlGroup>
  );
}

export default GrowthInput;
