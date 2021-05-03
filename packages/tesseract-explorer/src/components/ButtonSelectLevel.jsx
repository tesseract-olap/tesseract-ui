import {Button, Popover} from "@blueprintjs/core";
import React, {memo} from "react";
import {stringifyName} from "../utils/transform";
import {shallowEqualExceptFns} from "../utils/validation";
import {DimensionMenu} from "./MenuDimension";

/**
 * @typedef {BlueprintCore.IButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>} ButtonProps
 */

/**
 * @typedef OwnProps
 * @property {TessExpl.Struct.LevelDescriptor[]} selectedItems
 * @property {(
 *   level: OlapClient.PlainLevel,
 *   hierarchy: OlapClient.PlainHierarchy,
 *   dimension: OlapClient.PlainDimension,
 *   ) => any} onItemSelect
 * @property {boolean} [usePortal]
 */

/** @type {React.FC<ButtonProps & OwnProps>} */
export const ButtonSelectLevel = props => {
  const {selectedItems, onItemSelect, usePortal, ...buttonProps} = props;
  return (
    <Popover
      autoFocus={false}
      boundary="viewport"
      fill={props.fill}
      usePortal={usePortal}
    >
      <Button {...buttonProps} />
      <DimensionMenu
        selectedItems={selectedItems.map(stringifyName)}
        onItemSelect={onItemSelect}
      />
    </Popover>
  );
};

export const MemoButtonSelectLevel = memo(ButtonSelectLevel, shallowEqualExceptFns);
