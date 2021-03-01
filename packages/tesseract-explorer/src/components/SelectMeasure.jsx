import {Alignment, Button, MenuItem} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import classNames from "classnames";
import React, {memo} from "react";
import {safeRegExp} from "../utils/transform";
import {useTranslation} from "../utils/useTranslation";
import {shallowEqualExceptFns} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {boolean} [fill]
 * @property {import("@blueprintjs/core").IconName | false} [icon]
 * @property {import("@datawheel/olap-client").AdaptedMeasure[]} items
 * @property {import("@blueprintjs/select").ItemListPredicate<import("@datawheel/olap-client").AdaptedMeasure>} [itemListPredicate]
 * @property {import("@blueprintjs/select").ItemRenderer<import("@datawheel/olap-client").AdaptedMeasure>} [itemRenderer]
 * @property {(item: import("@datawheel/olap-client").AdaptedMeasure) => void} onItemSelect
 * @property {string} [placeholder]
 * @property {string | undefined} selectedItem
 * @property {boolean} [usePortal]
 */

/** @type {Required<Pick<OwnProps, "icon" | "itemListPredicate" | "itemRenderer">>} */
const defaultProps = {
  icon: "timeline-bar-chart",
  itemListPredicate(query, items) {
    const tester = safeRegExp(query, "i");
    return items.filter(item => tester.test(item.caption || item.name));
  },
  itemRenderer(item, {handleClick, modifiers}) {
    return (
      <MenuItem
        active={modifiers.active}
        icon="th-list"
        key={item.uri}
        onClick={handleClick}
        text={item.caption}
      />
    );
  }
};

/** @type {React.FC<OwnProps>} */
const SelectMeasure = props => {
  const {fill, usePortal} = props;

  const {translate: t} = useTranslation();

  return (
    <Select
      className={classNames("select-measure", props.className)}
      filterable={props.items.length > 6}
      itemListPredicate={props.itemListPredicate || defaultProps.itemListPredicate}
      itemRenderer={props.itemRenderer || defaultProps.itemRenderer}
      items={props.items}
      onItemSelect={props.onItemSelect}
      popoverProps={{fill, minimal: true, usePortal, portalClassName: "select-measure-overlay"}}
    >
      <Button
        alignText={Alignment.LEFT}
        className={props.className}
        fill={fill}
        icon={props.icon || defaultProps.icon}
        rightIcon="double-caret-vertical"
        text={props.selectedItem || t("selectmeasure_placeholder")}
      />
    </Select>
  );
};

SelectMeasure.defaultProps = defaultProps;

export default memo(SelectMeasure, shallowEqualExceptFns);
