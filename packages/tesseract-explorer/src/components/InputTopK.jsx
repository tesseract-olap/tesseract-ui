import {ControlGroup, FormGroup, HTMLSelect, NumericInput} from "@blueprintjs/core";
import React, {memo} from "react";
import {stringifyName} from "../utils/transform";
import {shallowEqualExceptFns} from "../utils/validation";
import SelectorLevelMono from "./SelectorLevelMono";
import MeasureSelector from "./SelectorMeasure";

/**
 * @typedef OwnProps
 * @property {(value: Partial<import("../reducers").TopkQueryState>) => any} onChange
 * @property {{value: string, label: string}[]} [orderOptions]
 */

/**
 * @type {React.FC<import("../reducers").TopkQueryState & OwnProps>}
 */
const InputTopK = function({amount, level, measure, onChange, order, orderOptions}) {
  return (
    <ControlGroup className="topk-input" vertical={true}>
      <SelectorLevelMono
        className="topk-input-level"
        fill={true}
        icon="layer"
        onItemSelect={level => onChange({level: stringifyName(level)})}
        selectedItem={level}
      />
      <MeasureSelector
        className="topk-input-measure"
        fill={true}
        icon="th-list"
        onItemSelect={measure => onChange({measure})}
        selectedItem={measure}
      />
      <FormGroup inline={true} label="Amount">
        <NumericInput
          className="topk-input-amount"
          fill={true}
          onValueChange={amount => onChange({amount})}
          value={amount}
        />
      </FormGroup>
      <FormGroup inline={true} label="Order">
        <HTMLSelect
          className="topk-input-order"
          fill={true}
          onChange={evt => onChange({order: evt.target.value == "asc" ? "asc" : "desc"})}
          options={orderOptions}
          value={order}
        />
      </FormGroup>
    </ControlGroup>
  );
};

InputTopK.defaultProps = {
  orderOptions: [{value: "desc", label: "descending"}, {value: "asc", label: "ascending"}]
};

export default memo(InputTopK, shallowEqualExceptFns);
