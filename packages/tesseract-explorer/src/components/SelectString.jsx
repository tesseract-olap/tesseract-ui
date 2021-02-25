import {Alignment, Button, MenuItem} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import classNames from "classnames";
import React from "react";
import {safeRegExp} from "../utils/transform";

/**
 * @typedef {string | number | import("@blueprintjs/core").IOptionProps} IOptionProps
 */

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {boolean} [fill]
 * @property {string} [placeholder]
 * @property {import("@blueprintjs/select").ItemListPredicate<IOptionProps>} [itemListPredicate]
 * @property {import("@blueprintjs/select").ItemRenderer<IOptionProps>} [itemRenderer]
 * @property {IOptionProps[]} items
 * @property {string | number | undefined} selectedItem
 * @property {(selectedItem: IOptionProps) => void} onItemSelect
 */

/** @type {React.FC<OwnProps>} */
const SelectString = props => {
  const {fill, items, selectedItem, placeholder = ""} = props;

  return (
    <Select
      className={classNames("select-stringproperty", props.className)}
      itemListPredicate={props.itemListPredicate}
      itemRenderer={props.itemRenderer}
      items={items}
      filterable={items.length > 6}
      onItemSelect={props.onItemSelect}
      popoverProps={{fill, minimal: true, captureDismiss: true, portalClassName: "select-stringproperty-overlay"}}
    >
      <Button
        alignText={Alignment.LEFT}
        className={props.className}
        fill={fill}
        rightIcon="double-caret-vertical"
        text={selectedItem || placeholder}
      />
    </Select>
  );
};

SelectString.defaultProps = {
  itemListPredicate(query, items) {
    const tester = safeRegExp(query, "i");
    return items.filter(item => tester.test(`${typeof item === "object" ? item.label || item.value : item}`));
  },
  itemRenderer(item, {modifiers, handleClick}) {
    const text = typeof item === "object" ? item.label || item.value : item;
    return (
      <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        key={text}
        onClick={handleClick}
        text={text}
      />
    );
  }
};

export default SelectString;
