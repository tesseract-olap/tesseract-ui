import {ControlGroup, HTMLSelect, Popover, PopoverInteractionKind, Tag, NumericInput} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import SelectMeasure from "../containers/ConnectedSelectMeasure";
import {Comparison} from "../enums";
import {summaryRca, summaryFilter} from "../utils/format";

/**
 * @typedef OwnProps
 * @property {FilterItem} item
 * @property {(item: FilterItem) => void} [onToggle]
 * @property {(item: FilterItem) => void} [onRemove]
 * @property {(item: FilterItem) => void} [onUpdate]
 */

/** @type {React.FC<OwnProps>} */
const TagFilter = ({item, onRemove, onToggle, onUpdate}) => {
  const content =
    <ControlGroup className="filter-input" vertical={true}>
      <SelectMeasure
        selectedItem={item.measure}
        fill={true}
        onItemSelect={measure => onUpdate({...item, measure: measure.name})}
      />
      <HTMLSelect fill onChange={this.setOperatorHandler} value={item.comparison}>
        <option value={Comparison.EQ}>EQ</option>
        <option value={Comparison.LT}>LT</option>
        <option value={Comparison.LTE}>LTE</option>
        <option value={Comparison.GT}>HT</option>
        <option value={Comparison.GTE}>HTE</option>
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
