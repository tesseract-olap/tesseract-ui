import {FormGroup, Popover, PopoverInteractionKind, Switch, Tag} from "@blueprintjs/core";
import classNames from "classnames";
import React, {memo, useMemo} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {selectLocale} from "../state/params/selectors";
import {selectLevelTriadMap} from "../state/selectors";
import {filterMap} from "../utils/array";
import {abbreviateFullName} from "../utils/format";
import {getCaption} from "../utils/string";
import {keyBy} from "../utils/transform";
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

  const locale = useSelector(selectLocale);
  const levelTriadMap = useSelector(selectLevelTriadMap);

  const activeProperties = filterMap(item.properties, item =>
    isActiveItem(item) ? item.key : null
  );

  const label = useMemo(() => {
    const triad = levelTriadMap[`${item.dimension}.${item.hierarchy}.${item.level}`];
    const triadCaptions = triad.map(item => getCaption(item, locale.code));
    return t("params.tag_drilldowns", {
      abbr: abbreviateFullName(triadCaptions, t("params.tag_drilldowns_abbrjoint")),
      dimension: triadCaptions[0],
      hierarchy: triadCaptions[1],
      level: triadCaptions[2],
      propCount: activeProperties.length
    });
  }, [activeProperties.join("-"), item, locale.code]);

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
      {label}
    </Tag>;

  const propertyRecords = useMemo(
    () => keyBy(item.properties, item => item.key),
    [item.properties]
  );

  if (item.properties.length === 0) {
    return target;
  }

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
          itemPredicate={(query, item) => query.test(item.name)}
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
