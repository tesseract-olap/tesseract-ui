import {Alignment, Button, MenuItem, Text} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import React from "react";

function GenericSelector(props) {
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

  const activeItem = props.activeItem;
  const popoverProps = {
    ...props.popoverProps,
    targetTagName: props.fill ? "div" : props.popoverProps.targetTagName || "span",
    wrapperTagName: props.fill ? "div" : props.popoverProps.wrapperTagName || "span"
  };
  return (
    <Select {...props} popoverProps={popoverProps} filterable={props.items.length > 8}>
      <Button
        alignText={Alignment.LEFT}
        className={props.className}
        fill={props.fill}
        icon={props.icon}
        minimal={props.minimal}
        rightIcon="double-caret-vertical"
        text={activeItem ? activeItem.name || activeItem.key : props.noSelectedText}
      />
    </Select>
  );
}

GenericSelector.defaultProps = {
  itemRenderer(item, {handleClick, index, modifiers, query}) {
    return (
      <MenuItem
        key={item.key || item.name}
        onClick={handleClick}
        text={item.name || item.key}
      />
    );
  },
  minimal: false,
  popoverProps: {
    minimal: true
  }
};

export default GenericSelector;
