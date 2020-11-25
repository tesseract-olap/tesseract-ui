import {Button, Popover} from "@blueprintjs/core";
import React, {memo} from "react";
import {stringifyName} from "../utils/transform";
import {shallowEqualExceptFns} from "../utils/validation";
import MenuDimensions from "./MenuDimension";

/**
 * @typedef {import("@blueprintjs/core").IButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>} ButtonProps
 */

/**
 * @typedef OwnProps
 * @property {TessExpl.Struct.LevelRef[]} selectedItems
 * @property {(
 *   level: import("@datawheel/olap-client").AdaptedLevel,
 *   hierarchy: import("@datawheel/olap-client").AdaptedHierarchy,
 *   dimension: import("@datawheel/olap-client").AdaptedDimension
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
