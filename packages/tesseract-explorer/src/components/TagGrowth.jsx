import {
  FormGroup,
  Popover,
  PopoverInteractionKind,
  Tag
} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import SelectMeasure from "../containers/ConnectedSelectMeasure";
import {summaryGrowth} from "../utils/format";
import {stringifyName} from "../utils/transform";
import SelectTimeLevel from "./SelectTimeLevel";

/**
 * @typedef OwnProps
 * @property {GrowthItem} item
 * @property {(item: GrowthItem) => void} onToggle
 * @property {(item: GrowthItem) => void} onRemove
 * @property {(item: GrowthItem) => void} onUpdate
 */

/** @type {React.FC<OwnProps>} */
const TagGrowth = ({item, onRemove, onToggle, onUpdate}) => {
  const content =
    <div className="growth-submenu">
      <FormGroup label="Measure" helperText=".">
        <SelectMeasure
          selectedItem={item.measure}
          fill={true}
          onItemSelect={measure => onUpdate({...item, measure: measure.name})}
          usePortal={false}
        />
      </FormGroup>
      <FormGroup label="Time level">
        <SelectTimeLevel
          selectedItem={item.level}
          fill={true}
          onItemSelect={level =>
            onUpdate({...item, level: stringifyName(level)})
          }
          usePortal={false}
        />
      </FormGroup>
    </div>;

  const target =
    <Tag
      className={classNames("tag-item tag-growth", {hidden: !item.active})}
      fill={true}
      icon="trending-up"
      interactive={true}
      large={true}
      onClick={() => onToggle(item)}
      onRemove={evt => {
        evt.stopPropagation();
        onRemove(item);
      }}
    >
      {summaryGrowth(item) || "[Incomplete parameters]"}
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