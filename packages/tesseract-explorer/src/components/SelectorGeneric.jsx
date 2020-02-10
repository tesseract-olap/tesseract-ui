import {Alignment, Button} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import React from "react";

/**
 * @template T
 * @typedef OwnProps
 * @property {(item: T) => any} children
 * @property {string} [className]
 * @property {boolean} [fill]
 * @property {import("@blueprintjs/core").IconName | false} [icon]
 * @property {T[]} items
 * @property {boolean} [minimal]
 * @property {string} [noOptionsText]
 * @property {string} [noSelectedText]
 * @property {T} selectedItem
 */

/**
 * @template T
 * @type {React.FC<import("@blueprintjs/select").ISelectProps<T> & OwnProps<T>>}
 */
const SelectGeneric = props => {
  if (props.items.length === 0) {
    return (
      <Button
        alignText={Alignment.LEFT}
        className={props.className}
        disabled={true}
        fill={props.fill}
        icon={props.icon}
        minimal={props.minimal}
        text={props.noOptionsText}
      />
    );
  }

  const selectedItem = props.selectedItem;
  return (
    <Select
      {...props}
      popoverProps={{...props.popoverProps, fill: props.fill}}
      filterable={props.items.length > 8}
    >
      {props.children(selectedItem)}
    </Select>
  );
};

SelectGeneric.defaultProps = {
  itemRenderer() {
    throw new Error("SelectGeneric needs an itemRenderer function.");
  },
  minimal: false,
  popoverProps: {
    boundary: "viewport",
    fill: true,
    minimal: true
  }
};

export default SelectGeneric;
