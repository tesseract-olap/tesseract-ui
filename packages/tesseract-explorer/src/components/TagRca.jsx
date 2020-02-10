import {ControlGroup, Popover, PopoverInteractionKind, Tag} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import SelectMeasure from "../containers/ConnectedSelectMeasure";
import {summaryRca} from "../utils/format";
import {stringifyName} from "../utils/transform";
import SelectLevel from "./SelectLevel";

/**
 * @typedef OwnProps
 * @property {RcaItem} item
 * @property {(item: RcaItem) => void} [onToggle]
 * @property {(item: RcaItem) => void} [onRemove]
 * @property {(item: RcaItem) => void} [onUpdate]
 */

/** @type {React.FC<OwnProps>} */
const TagRca = ({item, onRemove, onToggle, onUpdate}) => {
  const content =
    <ControlGroup className="rca-input" vertical={true}>
      <SelectLevel
        selectedItem={item.level1}
        fill={true}
        onItemSelect={level => onUpdate({...item, level1: stringifyName(level)})}
      />
      <SelectLevel
        selectedItem={item.level2}
        fill={true}
        onItemSelect={level => onUpdate({...item, level2: stringifyName(level)})}
      />
      <SelectMeasure
        selectedItem={item.measure}
        fill={true}
        onItemSelect={measure => onUpdate({...item, measure: measure.name})}
      />
    </ControlGroup>;

  const target =
    <Tag
      className={classNames("tag-item tag-rca", {hidden: !item.active})}
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
      {summaryRca(item) || "[Incomplete parameters]"}
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

export default TagRca;
