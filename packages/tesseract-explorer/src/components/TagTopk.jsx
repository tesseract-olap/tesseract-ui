import {ControlGroup, FormGroup, HTMLSelect, NumericInput, Popover, PopoverInteractionKind, Tag} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import SelectMeasure from "../containers/ConnectedSelectMeasure";
import {orderOptions} from "../enums";
import {useTranslation} from "../hooks/translation";
import {summaryTopk} from "../utils/format";
import {stringifyName} from "../utils/transform";
import SelectLevel from "./SelectLevel";

/**
 * @typedef OwnProps
 * @property {TessExpl.Struct.TopkItem} item
 * @property {(item: TessExpl.Struct.TopkItem) => void} [onToggle]
 * @property {(item: TessExpl.Struct.TopkItem) => void} [onRemove]
 * @property {(item: TessExpl.Struct.TopkItem) => void} [onUpdate]
 */

/** @type {React.FC<OwnProps>} */
const TagTopk = props => {
  const {item, onRemove, onToggle, onUpdate} = props;
  const {translate: t} = useTranslation();

  const content =
    <ControlGroup className="topk-input" vertical={true}>
      <SelectLevel
        className="topk-input-level"
        fill={true}
        onItemSelect={level => onUpdate({...item, level: stringifyName(level)})}
        selectedItem={item.level}
      />
      <SelectMeasure
        className="topk-input-measure"
        fill={true}
        onItemSelect={measure => onUpdate({...item, measure: measure.name})}
        selectedItem={item.measure}
      />
      <FormGroup inline={true} label={t("params.label_amount")}>
        <NumericInput
          className="topk-input-amount"
          fill={true}
          onValueChange={amount => onUpdate({...item, amount})}
          value={item.amount}
        />
      </FormGroup>
      <FormGroup inline={true} label={t("params.label_sorting_order")}>
        <HTMLSelect
          className="topk-input-order"
          fill={true}
          onChange={evt => onUpdate({...item, order: evt.target.value === "asc" ? "asc" : "desc"})}
          options={orderOptions}
          value={item.order}
        />
      </FormGroup>
    </ControlGroup>;

  const target =
    <Tag
      className={classNames("tag-item tag-topk", {hidden: !item.active})}
      fill={true}
      icon={item.order === "asc" ? "horizontal-bar-chart-asc" : "horizontal-bar-chart-desc"}
      interactive={true}
      large={true}
      onClick={() => onToggle(item)}
      onRemove={evt => {
        evt.stopPropagation();
        onRemove(item);
      }}
    >
      {summaryTopk(item) || t("placeholders.incomplete")}
    </Tag>;

  return (
    <Popover
      autoFocus={true}
      boundary="viewport"
      captureDismiss={true}
      content={content}
      fill={true}
      interactionKind={PopoverInteractionKind.HOVER}
      popoverClassName="param-popover"
      target={target}
    />
  );
};

export default TagTopk;
