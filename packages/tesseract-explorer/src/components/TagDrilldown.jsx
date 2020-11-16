import {FormGroup, Popover, PopoverInteractionKind, Position, Tag} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import {abbreviateFullName} from "../utils/format";
import {levelRefToArray} from "../utils/transform";
import SelectString from "./SelectString";
import {TransferInput} from "./TransferInput";

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

  /** @type {import("@blueprintjs/core").IOptionProps[]} */
  const captionItems = [{label: "[None selected]", value: ""}];

  const content =
    <div className="drilldown-submenu">
      <FormGroup label="Caption" helperText="Captions replace the default label returned by the server with another property.">
        <SelectString
          fill={true}
          items={captionItems.concat(item.properties.map(item => ({value: item.name})))}
          // @ts-ignore
          onItemSelect={caption => onCaptionUpdate(item, caption.label || caption.value || caption)}
          selectedItem={item.captionProperty}
        />
      </FormGroup>
      <FormGroup label="Properties" helperText="Properties return additional information for each subdivision of the data.">
        <TransferInput
          getLabel={item => item.name}
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
      hoverCloseDelay={500}
      interactionKind={PopoverInteractionKind.HOVER}
      popoverClassName="param-popover"
      position={Position.RIGHT_TOP}
      target={target}
    />
  );
};

export default TagDrilldown;
