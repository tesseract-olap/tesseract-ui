import {ControlGroup, Popover, PopoverInteractionKind, Tag} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import SelectMeasure from "../containers/ConnectedSelectMeasure";
import {summaryRca} from "../utils/format";
import {stringifyName} from "../utils/transform";
import {useTranslation} from "../utils/useTranslation";
import {isRcaItem} from "../utils/validation";
import SelectLevel from "./SelectLevel";

/**
 * @typedef OwnProps
 * @property {TessExpl.Struct.RcaItem} item
 * @property {(item: TessExpl.Struct.RcaItem) => void} onToggle
 * @property {(item: TessExpl.Struct.RcaItem) => void} onRemove
 * @property {(item: TessExpl.Struct.RcaItem) => void} onUpdate
 */

/** @type {React.FC<OwnProps>} */
const TagRca = props => {
  const {item, onRemove, onToggle, onUpdate} = props;
  const {translate: t} = useTranslation();

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
      {isRcaItem(item) ? t("params.summary_rca", summaryRca(item)) : t("placeholders.incomplete")}
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
