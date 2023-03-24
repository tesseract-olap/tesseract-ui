import {Menu, ThemeIcon, useMantineTheme} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import {stringifyName} from "../utils/transform";
import {DimensionMenu} from "./MenuDimension";

/**
 * @typedef OwnProps
 * @property {React.ReactNode} children
 * @property {TessExpl.Struct.LevelDescriptor[]} selectedItems
 * @property {React.ComponentProps<DimensionMenu>["onItemSelect"]} onItemSelect
 */

/** @type {React.FC<OwnProps>} */
export const ButtonSelectLevel = props => {
  const {selectedItems, onItemSelect, ...buttonProps} = props;

  const theme = useMantineTheme();
  const isMediumScreen = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);

  return (
    <Menu
      closeOnClickOutside
      closeOnEscape
      position={isMediumScreen ? "left" : "right"}
      shadow="md"
      withArrow
      withinPortal
    >
      <Menu.Target>
        <ThemeIcon {...buttonProps}>{props.children}</ThemeIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <DimensionMenu
          isMediumScreen={isMediumScreen}
          selectedItems={selectedItems.map(stringifyName)}
          onItemSelect={onItemSelect}
        />
      </Menu.Dropdown>
    </Menu>
  );
};
