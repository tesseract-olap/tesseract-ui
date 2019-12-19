import {Alignment, Button, Popover, Position} from "@blueprintjs/core";
import React, {memo} from "react";
import {ensureArray} from "../utils/array";
import {abbreviateFullName} from "../utils/format";
import {shallowEqualExceptFns} from "../utils/validation";
import MenuDimension from "./MenuDimension";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {boolean} fill
 * @property {import("@blueprintjs/core").IconName} icon
 * @property {string} [placeholder]
 * @property {string|undefined} [selectedItem]
 * @property {keyof JSX.IntrinsicElements} [targetTagName]
 * @property {keyof JSX.IntrinsicElements} [wrapperTagName]
 * @property {(level: import("../structs").JSONLevel) => any} onItemSelect
 */

/** @type {React.FC<OwnProps>} */
const SelectorLevelMono = function({
  className,
  fill,
  icon,
  onItemSelect,
  placeholder,
  selectedItem,
  targetTagName,
  wrapperTagName
}) {
  return (
    <Popover
      autoFocus={false}
      boundary="viewport"
      className={className}
      minimal={true}
      position={Position.BOTTOM_LEFT}
      targetTagName={fill ? "div" : targetTagName}
      wrapperTagName={fill ? "div" : wrapperTagName}
    >
      <Button
        alignText={Alignment.LEFT}
        fill={fill}
        icon={icon}
        rightIcon="double-caret-vertical"
        text={selectedItem ? abbreviateFullName(selectedItem) : placeholder}
      />
      <MenuDimension
        selectedItems={ensureArray(selectedItem)}
        onItemSelected={onItemSelect}
      />
    </Popover>
  );
};

SelectorLevelMono.defaultProps = {
  placeholder: "Level...",
  targetTagName: "span",
  wrapperTagName: "span"
};

export default memo(SelectorLevelMono, shallowEqualExceptFns);
