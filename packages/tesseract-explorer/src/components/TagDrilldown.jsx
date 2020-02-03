import {FormGroup, HTMLSelect, Popover, PopoverInteractionKind, Position, Tag} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import {abbreviateFullName} from "../utils/format";
import {levelRefToArray} from "../utils/transform";
import TransferInput from "./TransferInput";

/**
 * @typedef OwnProps
 * @property {DrilldownItem} item
 * @property {(item: DrilldownItem) => void} [onRemove]
 * @property {(item: DrilldownItem) => void} [onToggle]
 * @property {(item: DrilldownItem, caption: string) => void} [onCaptionUpdate]
 * @property {(item: DrilldownItem, props: PropertyItem[]) => void} [onPropertiesUpdate]
 */

/** @type {React.FC<OwnProps>} */
const TagDrilldown = ({item, onRemove, onToggle, onCaptionUpdate, onPropertiesUpdate}) => {
  const target =
    <Tag
      className={classNames("tag-item tag-drilldown", {hidden: !item.active})}
      fill={true}
      icon="layer"
      interactive={true}
      large={true}
      onClick={() => onToggle(item)}
      onRemove={evt => {
        evt.stopPropagation();
        onRemove(item);
      }}
    >
      {abbreviateFullName(levelRefToArray(item))}
    </Tag>;

  if (item.properties.length === 0) {
    return target;
  }

  const content =
    <div className="property-selector">
      <FormGroup inline={true} label="Caption">
        <HTMLSelect
          onChange={evt => onCaptionUpdate(item, evt.target.value)}
          options={[{label: "[None]", value: ""}].concat(item.properties.map(item => ({value: item.property})))}
        />
      </FormGroup>
      <FormGroup label="Properties">
        <TransferInput
          items={item.properties}
          onChange={properties => onPropertiesUpdate(item, properties)}
        />
      </FormGroup>
    </div>;

  return (
    <Popover
      autoFocus={true}
      boundary="viewport"
      content={content}
      fill={true}
      interactionKind={PopoverInteractionKind.HOVER}
      popoverClassName="param-popover"
      position={Position.RIGHT_TOP}
      target={target}
    />
  );
};

export default TagDrilldown;
