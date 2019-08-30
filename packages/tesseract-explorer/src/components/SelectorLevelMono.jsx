import {Alignment, Button, Popover, Position} from "@blueprintjs/core";
import React from "react";
import {abbreviateFullName} from "../utils/format";
import MenuDimensions from "./MenuDimension";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {boolean} fill
 * @property {import("@blueprintjs/core").IconName} icon
 * @property {string} [placeholder]
 * @property {string} selectedItem
 * @property {keyof JSX.IntrinsicElements} [targetTagName]
 * @property {keyof JSX.IntrinsicElements} [wrapperTagName]
 * @property {(level: import("../reducers/cubesReducer").JSONLevel) => any} onItemSelect
 */

/** @type {React.FC<OwnProps>} */
const LevelSelector = function(props) {
  const {selectedItem} = props;

  return (
    <Popover
      autoFocus={false}
      boundary="viewport"
      className={props.className}
      minimal={true}
      position={Position.BOTTOM_LEFT}
      targetTagName={props.fill ? "div" : props.targetTagName}
      wrapperTagName={props.fill ? "div" : props.wrapperTagName}
    >
      <Button
        alignText={Alignment.LEFT}
        fill={props.fill}
        icon={props.icon}
        rightIcon="double-caret-vertical"
        text={abbreviateFullName(selectedItem) || props.placeholder}
      />
      <MenuDimensions
        isItemSelected={item => item.fullname === selectedItem}
        onItemSelected={props.onItemSelect}
      />
    </Popover>
  );
};

LevelSelector.defaultProps = {
  placeholder: "Level...",
  targetTagName: "span",
  wrapperTagName: "span"
};

export default LevelSelector;
