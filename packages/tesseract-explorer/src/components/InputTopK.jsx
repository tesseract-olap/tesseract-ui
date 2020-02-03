import {ControlGroup, FormGroup, HTMLSelect, NumericInput} from "@blueprintjs/core";
import React, {memo} from "react";
import {stringifyName} from "../utils/transform";
import {shallowEqualExceptFns} from "../utils/validation";
import SelectLevelMono from "./SelectLevel";
import SelectMeasure from "../containers/ConnectedSelectMeasure";

/**
 * @typedef OwnProps
 * @property {(value: Partial<TopkItem>) => any} onChange
 * @property {{value: string, label: string}[]} [orderOptions]
 */

/**
 * @type {React.FC<TopkItem & OwnProps>}
 */
const InputTopK = function({amount, level, measure, onChange, order, orderOptions}) {
  return (
    <ControlGroup className="topk-input" vertical={true}>
    </ControlGroup>
  );
};

InputTopK.defaultProps = {
};

export default memo(InputTopK, shallowEqualExceptFns);
