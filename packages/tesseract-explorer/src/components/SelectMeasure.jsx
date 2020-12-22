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
 * @property {import("@datawheel/olap-client").AdaptedMeasure[]} items
 * @property {import("@blueprintjs/select").ItemListPredicate<import("@datawheel/olap-client").AdaptedMeasure>} [itemListPredicate]
 * @property {import("@blueprintjs/select").ItemRenderer<import("@datawheel/olap-client").AdaptedMeasure>} [itemRenderer]
 * @property {(item: import("@datawheel/olap-client").AdaptedMeasure) => void} onItemSelect
 * @property {string} [placeholder]
 * @property {string | undefined} selectedItem
 * @property {boolean} [usePortal]
 */

const defaultProps = {

  /**
   * @type {import("@blueprintjs/select").ItemListPredicate<import("@datawheel/olap-client").AdaptedMeasure>}
   */
  itemListPredicate(query, items) {
    const tester = safeRegExp(query, "i");
    return items.filter(item => tester.test(item.caption || item.name));
  },

  /**
   * @type {import("@blueprintjs/select").ItemRenderer<import("@datawheel/olap-client").AdaptedMeasure>}
   */
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
      itemListPredicate={props.itemListPredicate || defaultProps.itemListPredicate}
      itemRenderer={props.itemRenderer || defaultProps.itemRenderer}
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

SelectMeasure.defaultProps = defaultProps;

export default memo(SelectMeasure, shallowEqualExceptFns);
