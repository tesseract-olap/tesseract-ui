import {ActionIcon, Menu} from "@mantine/core";
import React from "react";
import {stringifyName} from "../utils/transform";
import {DimensionMenu} from "./MenuDimension";

/**
 * @typedef OwnProps
 * @property {React.ReactNode} children
 * @property {TessExpl.Struct.LevelDescriptor[]} selectedItems
 * @property {React.ComponentProps<DimensionMenu>["onItemSelect"]} onItemSelect
 */

/** @type {React.FC<BlueprintCore.ButtonProps & OwnProps>} */
export const ButtonSelectLevel = props => {
  const {selectedItems, onItemSelect, ...buttonProps} = props;
  return (
    <Menu
      closeOnClickOutside
      closeOnEscape
      position="right" 
      shadow="md"
      withArrow
      withinPortal
    >
      <Menu.Target>
        <ActionIcon {...buttonProps}>{props.children}</ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <DimensionMenu
          selectedItems={selectedItems.map(stringifyName)}
          onItemSelect={onItemSelect}
        />
      </Menu.Dropdown>
    </Menu>
  );
};
