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

/** @type {Required<Pick<OwnProps, "itemListPredicate" | "itemRenderer">>} */
const defaultProps = {
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

/** @type {React.FC<OwnProps>} */
export const SelectString = props => {
  const {fill, items} = props;
  return (
    <Select
      className={classNames("select-stringproperty", props.className)}
      itemListPredicate={props.itemListPredicate || defaultProps.itemListPredicate}
      itemRenderer={props.itemRenderer || defaultProps.itemRenderer}
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
        text={props.selectedItem || props.placeholder || ""}
      />
    </Select>
  );
};

SelectString.defaultProps = defaultProps;
