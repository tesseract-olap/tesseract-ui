import {ActionIcon, ActionIconProps, Menu, useMantineTheme} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import React from "react";
import {stringifyName} from "../utils/transform";
import type {LevelDescriptor} from "../utils/types";
import {DimensionMenu} from "./MenuDimension";

export const ButtonSelectLevel = (props: ActionIconProps & {
  children: React.ReactNode;
  onItemSelect: React.ComponentProps<typeof DimensionMenu>["onItemSelect"];
  selectedItems: LevelDescriptor[];
}) => {
  const {selectedItems, onItemSelect, children, ...buttonProps} = props;

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
        <ActionIcon {...buttonProps}>{children}</ActionIcon>
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
