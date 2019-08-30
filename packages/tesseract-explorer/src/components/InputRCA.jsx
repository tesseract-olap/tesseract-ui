import {ControlGroup} from "@blueprintjs/core";
import React from "react";
import LevelSelector from "./SelectorLevelMono";
import MeasureSelector from "./SelectorMeasure";

function RcaInput(props) {
  const {level1, level2, measure} = props;
  return (
    <ControlGroup className="rca-input" vertical={true}>
      <LevelSelector
        selectedItem={level1}
        fill={true}
        icon="layer"
        onItemSelect={level => props.onChange({level1: level.fullname})}
      />
      <LevelSelector
        selectedItem={level2}
        fill={true}
        icon="layer"
        onItemSelect={level => props.onChange({level2: level.fullname})}
      />
      <MeasureSelector
        selectedItem={measure}
        fill={true}
        icon="th-list"
        onItemSelect={measure => props.onChange({measure})}
      />
    </ControlGroup>
  );
}

export default RcaInput;
