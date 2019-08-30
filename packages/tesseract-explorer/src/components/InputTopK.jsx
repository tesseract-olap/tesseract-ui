import {ControlGroup, FormGroup, HTMLSelect, NumericInput} from "@blueprintjs/core";
import React from "react";
import LevelSelector from "./SelectorLevelMono";
import MeasureSelector from "./SelectorMeasure";

/**
 * @typedef OwnProps
 * @property {(value: import("../reducers").TopkQueryState) => any} onChange
 */

/**
 * @type {React.FC<import("../reducers").TopkQueryState & OwnProps>}
 */
const InputTopK = function(props) {
  const {amount, order, level, measure} = props;
  return (
    <ControlGroup className="topk-input" vertical={true}>
      <LevelSelector
        className="topk-input-level"
        fill={true}
        icon="layer"
        onItemSelect={level => props.onChange({level: level.fullname})}
        selectedItem={level}
      />
      <MeasureSelector
        className="topk-input-measure"
        fill={true}
        icon="th-list"
        onItemSelect={measure => props.onChange({measure})}
        selectedItem={measure}
      />
      <FormGroup inline={true} label="Amount">
        <NumericInput
          className="topk-input-amount"
          fill={true}
          onValueChange={amount => props.onChange({amount})}
          value={amount}
        />
      </FormGroup>
      <FormGroup inline={true} label="Order">
        <HTMLSelect
          className="topk-input-order"
          fill={true}
          onChange={evt =>
            props.onChange({order: evt.target.value == "asc" ? "asc" : "desc"})}
          options={[
            {value: "desc", label: "descending"},
            {value: "asc", label: "ascending"}
          ]}
          value={order}
        />
      </FormGroup>
    </ControlGroup>
  );
};

export default InputTopK;
