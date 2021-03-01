import {ControlGroup, HTMLSelect, NumericInput, Popover, PopoverInteractionKind, Tag} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import SelectMeasure from "../containers/ConnectedSelectMeasure";
import {Comparison} from "../enums";
import {summaryFilter} from "../utils/format";
import {useTranslation} from "../utils/useTranslation";

/**
 * @typedef OwnProps
 * @property {TessExpl.Struct.FilterItem} item
 * @property {(item: TessExpl.Struct.FilterItem) => void} onToggle
 * @property {(item: TessExpl.Struct.FilterItem) => void} onRemove
 * @property {(item: TessExpl.Struct.FilterItem) => void} onUpdate
 */

/** @type {React.FC<OwnProps>} */
const TagFilter = props => {
  const {item, onRemove, onToggle, onUpdate} = props;
  const {translate: t} = useTranslation();

  const content =
    <ControlGroup className="filter-input" vertical={true}>
      <SelectMeasure
        selectedItem={item.measure}
        fill={true}
        onItemSelect={measure => onUpdate({...item, measure: measure.name})}
      />
      <HTMLSelect fill onChange={this.setOperatorHandler} value={item.comparison}>
        <option value={Comparison.EQ}>{t("comparison.EQ")}</option>
        <option value={Comparison.NEQ}>{t("comparison.NEQ")}</option>
        <option value={Comparison.LT}>{t("comparison.LT")}</option>
        <option value={Comparison.LTE}>{t("comparison.LTE")}</option>
        <option value={Comparison.GT}>{t("comparison.HT")}</option>
        <option value={Comparison.GTE}>{t("comparison.HTE")}</option>
      </HTMLSelect>
      <NumericInput fill onValueChange={this.setValueHandler} value={item.inputtedValue} />
    </ControlGroup>;

  const target =
    <Tag
      className={classNames("tag-item tag-filter", {hidden: !item.active})}
      fill={true}
      icon="layout"
      interactive={true}
      large={true}
      onClick={() => onToggle(item)}
      onRemove={evt => {
        evt.stopPropagation();
        onRemove(item);
      }}
    >
      {summaryFilter(item)}
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

export default TagFilter;
