import { Alignment, Button, IconName } from "@blueprintjs/core";
import { ISelectProps, Select } from "@blueprintjs/select";
import React from "react";

interface OwnProps<T> {
  children(item: T): any;
  className?: string;
  fill?: boolean;
  icon?: IconName;
  items: T[];
  minimal?: boolean;
  noOptionsText?: string;
  noSelectedText?: string;
  selectedItem: T;
}

const SelectGeneric: React.FC<ISelectProps<T> & OwnProps<T>> = <T>(props) => {
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
