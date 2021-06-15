import {Button, Popover} from "@blueprintjs/core";
import React, {memo} from "react";
import {stringifyName} from "../utils/transform";
import {shallowEqualExceptFns} from "../utils/validation";
import {DimensionMenu} from "./MenuDimension";

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

/** @type {React.FC<BlueprintCore.ButtonProps & OwnProps>} */
export const ButtonSelectLevel = props => {
  const {selectedItems, onItemSelect, usePortal, ...buttonProps} = props;
  return (
    <Popover
      autoFocus={false}
      boundary="viewport"
      content={
        <DimensionMenu
          selectedItems={selectedItems.map(stringifyName)}
          onItemSelect={onItemSelect}
        />
      }
      fill={props.fill}
      target={<Button {...buttonProps} />}
      usePortal={usePortal}
    />
  );
};

export const MemoButtonSelectLevel = memo(ButtonSelectLevel, shallowEqualExceptFns);
