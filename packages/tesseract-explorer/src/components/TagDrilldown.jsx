import {FormGroup, Popover, PopoverInteractionKind, Switch, Tag} from "@blueprintjs/core";
import classNames from "classnames";
import React, {memo, useMemo} from "react";
import {useTranslation} from "../hooks/translation";
import {abbreviateFullName} from "../utils/format";
import {keyBy, levelRefToArray} from "../utils/transform";
import {isActiveItem} from "../utils/validation";
import {SelectObject} from "./Select";
import {TransferInput} from "./TransferInput";

/** @type {React.FC<import("./TransferInput").OwnProps<TessExpl.Struct.PropertyItem>>} */
// @ts-ignore
export const PropertiesTransferInput = TransferInput;

/** @type {React.FC<import("./Select").SelectObjectProps<{name: string, level?: string}>>} */
const SelectCaption = memo(SelectObject, (prev, next) => prev.selectedItem === next.selectedItem);

/**
 * @typedef OwnProps
 * @property {TessExpl.Struct.DrilldownItem} item
 * @property {(item: TessExpl.Struct.DrilldownItem) => void} onRemove
 * @property {(item: TessExpl.Struct.DrilldownItem) => void} onToggle
 * @property {(item: TessExpl.Struct.DrilldownItem, caption: string) => void} onCaptionUpdate
 * @property {(item: TessExpl.Struct.DrilldownItem, props: TessExpl.Struct.PropertyItem[]) => void} onPropertiesUpdate
 */

/** @type {React.FC<OwnProps>} */
const TagDrilldown = props => {
  const {item, onRemove, onToggle, onCaptionUpdate, onPropertiesUpdate} = props;
  const {translate: t} = useTranslation();

  const target =
    <Tag
      className={classNames("tag-item tag-drilldown", {hidden: !item.active})}
      fill={true}
      icon={
        <span onClickCapture={evt => evt.stopPropagation()}>
          <Switch checked={item.active} onChange={() => onToggle(item)} />
        </span>
      }
      interactive={true}
      large={true}
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

  const propertyRecords = useMemo(
    () => keyBy(item.properties, item => item.key),
    [item.properties]
  );

  const activeProperties = item.properties.filter(isActiveItem).map(item => item.key);

  const captionItems = [{name: t("placeholders.unselected")}].concat(item.properties);

  const content =
    <div className="drilldown-submenu">
      <FormGroup className="submenu-form-group" label={t("params.title_caption")}>
        <SelectCaption
          fill={true}
          items={captionItems}
          onItemSelect={caption => onCaptionUpdate(item, caption.level ? caption.name : "")}
          getLabel={item => item.name}
          selectedItem={item.captionProperty || undefined}
        />
      </FormGroup>
      <FormGroup className="submenu-form-group" label={t("params.title_properties")}>
        <PropertiesTransferInput
          activeItems={activeProperties}
          getLabel={item => item.name}
          items={propertyRecords}
          onChange={actProps => {
            const properties = item.properties.map(
              prop => ({...prop, active: actProps.includes(prop.key)})
            );
            onPropertiesUpdate(item, properties);
          }}
        />
      </FormGroup>
    </div>;

  return (
    <Popover
      boundary="viewport"
      content={content}
      fill={true}
      interactionKind={PopoverInteractionKind.CLICK}
      popoverClassName="param-popover"
    >
      {target}
    </Popover>
  );
};

export default TagDrilldown;
