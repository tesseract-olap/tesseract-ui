import {Alignment, Button, Popover, Position} from "@blueprintjs/core";
import React from "react";
import {ensureArray} from "../utils/array";
import TimeDimensionMenu from "./MenuTimeDimension";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {boolean} [fill]
 * @property {import("@blueprintjs/core").IconName | false} [icon]
 * @property {(level: OlapLevel) => void} [onItemSelect]
 * @property {string} [placeholder]
 * @property {string | undefined} selectedItem
 * @property {boolean} [usePortal]
 */

/** @type {React.FC<OwnProps>} */
const SelectTimeLevel = props => {
  const {
    fill,
    icon = "calendar",
    placeholder = "Time level..."
  } = props;

  return (
    <Popover
      autoFocus={false}
      boundary="viewport"
      className={props.className}
      content={
        <TimeDimensionMenu
          selectedItems={ensureArray(props.selectedItem)}
          onItemSelect={props.onItemSelect}
        />
      }
      fill={fill}
      minimal={true}
      position={Position.BOTTOM_LEFT}
      usePortal={props.usePortal}
      target={
        <Button
          alignText={Alignment.LEFT}
          fill={true}
          icon={icon}
          rightIcon="double-caret-vertical"
          text={props.selectedItem || placeholder}
        />
      }
    >
    </Popover>
  );
};

export default SelectTimeLevel;
