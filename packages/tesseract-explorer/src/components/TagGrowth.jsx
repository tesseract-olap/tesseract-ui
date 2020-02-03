import {Alignment, Button, ControlGroup, Popover, PopoverInteractionKind, Position, Tag} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import SelectMeasure from "../containers/ConnectedSelectMeasure";
import {ensureArray} from "../utils/array";
import {summaryGrowth} from "../utils/format";
import {stringifyName} from "../utils/transform";
import SelectTimeLevel from "./SelectTimeLevel";

/**
 * @typedef OwnProps
 * @property {GrowthItem} item
 * @property {(item: GrowthItem) => void} [onToggle]
 * @property {(item: GrowthItem) => void} [onRemove]
 * @property {(item: GrowthItem) => void} [onUpdate]
 */

/** @type {React.FC<OwnProps>} */
const TagGrowth = ({item, onRemove, onToggle, onUpdate}) => {
  const content =
    <ControlGroup className="growth-input" vertical={true}>
      <SelectMeasure
        selectedItem={item.measure}
        fill={true}
        onItemSelect={measure => onUpdate({...item, measure: measure.name})}
        usePortal={false}
      />
      <SelectTimeLevel
        selectedItem={item.level}
        fill={true}
        onItemSelect={level => onUpdate({...item, level: stringifyName(level)})}
        usePortal={false}
      />
    </ControlGroup>;

  const target =
    <Tag
      className={classNames("tag-item tag-growth", {hidden: !item.active})}
      fill={true}
      icon="trending-up"
      interactive={true}
      large={true}
      onClick={() => onToggle(item)}
      onRemove={() => onRemove(item)}
    >
      {summaryGrowth(item)}
    </Tag>;

  return <Popover
    autoFocus={true}
    boundary="viewport"
    captureDismiss={true}
    content={content}
    fill={true}
    interactionKind={PopoverInteractionKind.HOVER}
    popoverClassName="param-popover"
    target={target}
  />;
};

export default TagGrowth;
