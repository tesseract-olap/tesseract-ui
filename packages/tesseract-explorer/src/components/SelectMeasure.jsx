import {Alignment, Button, MenuItem} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import classNames from "classnames";
import React, {memo} from "react";
import {safeRegExp} from "../utils/transform";
import {shallowEqualExceptFns} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {boolean} [fill]
 * @property {import("@blueprintjs/core").IconName | false} [icon]
 * @property {OlapMeasure[]} items
 * @property {import("@blueprintjs/select").ItemListPredicate<OlapMeasure>} [itemListPredicate]
 * @property {import("@blueprintjs/select").ItemRenderer<OlapMeasure>} [itemRenderer]
 * @property {(item: OlapMeasure) => void} [onItemSelect]
 * @property {string} [placeholder]
 * @property {string | undefined} selectedItem
 * @property {boolean} [usePortal]
 */

/** @type {React.FC<OwnProps & import("../containers/ServerStatus").StateProps>} */
const SelectMeasure = props => {
  const {
    fill,
    icon = "timeline-bar-chart",
    placeholder = "Measure...",
    usePortal
  } = props;

  return (
    <Select
      className={classNames("select-measure", props.className)}
      filterable={props.items.length > 6}
      itemListPredicate={props.itemListPredicate}
      itemRenderer={props.itemRenderer}
      items={props.items}
      onItemSelect={props.onItemSelect}
      popoverProps={{fill, minimal: true, usePortal}}
    >
      <Button
        alignText={Alignment.LEFT}
        className={props.className}
        fill={fill}
        icon={icon}
        rightIcon="double-caret-vertical"
        text={props.selectedItem || placeholder}
      />
    </Select>
  );
};

SelectMeasure.defaultProps = {
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


export default memo(SelectMeasure, shallowEqualExceptFns);
