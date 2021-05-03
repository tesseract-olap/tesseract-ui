import {FormGroup, Popover, PopoverInteractionKind, Tag} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import {useTranslation} from "../hooks/translation";
import {summaryGrowth} from "../utils/format";
import {joinName} from "../utils/transform";
import {isGrowthItem} from "../utils/validation";
import {MemoSelectMeasure as SelectMeasure} from "./SelectMeasure";
import {SelectTimeLevel} from "./SelectTimeLevel";

/**
 * @typedef OwnProps
 * @property {TessExpl.Struct.GrowthItem} item
 * @property {(item: TessExpl.Struct.GrowthItem) => void} onToggle
 * @property {(item: TessExpl.Struct.GrowthItem) => void} onRemove
 * @property {(item: TessExpl.Struct.GrowthItem) => void} onUpdate
 */

/** @type {React.FC<OwnProps>} */
const TagGrowth = props => {
  const {item, onRemove, onToggle, onUpdate} = props;
  const {translate: t} = useTranslation();

  const content =
    <div className="growth-submenu">
      <FormGroup label={t("params.label_measure")} helperText=".">
        <SelectMeasure
          selectedItem={item.measure}
          fill={true}
          onItemSelect={measure => onUpdate({...item, measure: measure.name})}
          usePortal={false}
        />
      </FormGroup>
      <FormGroup label={t("params.label_timelevel")}>
        <SelectTimeLevel
          selectedItem={item.level}
          fill={true}
          onItemSelect={level =>
            onUpdate({...item, level: joinName([level.dimension, level.hierarchy, level.name])})
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
      {isGrowthItem(item) ? t("params.summary_growth", summaryGrowth(item)) : t("placeholders.incomplete")}
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
