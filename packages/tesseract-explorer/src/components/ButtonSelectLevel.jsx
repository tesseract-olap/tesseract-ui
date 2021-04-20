import {Button, Popover} from "@blueprintjs/core";
import React, {memo} from "react";
import {stringifyName} from "../utils/transform";
import {shallowEqualExceptFns} from "../utils/validation";
import MenuDimensions from "./MenuDimension";

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
const ButtonSelectLevel = ({selectedItems, onItemSelect, usePortal, ...props}) =>
  <Popover autoFocus={false} boundary="viewport" fill={props.fill} usePortal={usePortal}>
    <Button {...props} />
    <MenuDimensions selectedItems={selectedItems.map(stringifyName)} onItemSelect={onItemSelect}/>
  </Popover>;

export default memo(ButtonSelectLevel, shallowEqualExceptFns);
