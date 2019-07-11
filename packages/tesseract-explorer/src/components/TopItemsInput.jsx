import {ControlGroup, FormGroup, HTMLSelect, NumericInput} from "@blueprintjs/core";
import React from "react";
import LevelSelector from "./SelectorLevel";
import MeasureSelector from "./SelectorMeasure";

/**
 * @typedef OwnProps
 * @property {(value: Partial<import("../reducers/queryReducer").TopQueryState>) => any} onChange
 */

/**
 * @type {React.FunctionComponent<import("../reducers/queryReducer").TopQueryState & OwnProps>}
 */
const TopItemsInput = function(props) {
  const {amount, order, level, measure} = props;
  return (
    <ControlGroup className="top-input" vertical={true}>
      <LevelSelector
        className="top-input-level"
        fill={true}
        icon="layer"
        onItemSelect={level => props.onChange({level: level.fullName})}
        selectedItem={level}
      />
      <MeasureSelector
        className="top-input-measure"
        fill={true}
        icon="th-list"
        onItemSelect={measure => props.onChange({measure})}
        selectedItem={measure}
      />
      <FormGroup inline={true} label="Amount">
        <NumericInput
          className="top-input-amount"
          fill={true}
          onValueChange={amount => props.onChange({amount})}
          value={amount}
        />
      </FormGroup>
      <FormGroup inline={true} label="Order">
        <HTMLSelect
          className="top-input-order"
          fill={true}
          onChange={evt =>
            props.onChange({order: evt.target.value == "asc" ? "asc" : "desc"})}
          options={[
            {value: "desc", label: "descendent"},
            {value: "asc", label: "ascendent"}
          ]}
          value={order}
        />
      </FormGroup>
    </ControlGroup>
  );
};

export default TopItemsInput;
