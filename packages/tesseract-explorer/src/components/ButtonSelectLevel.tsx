import {ActionIcon, ActionIconProps, Box, Menu, Portal, useMantineTheme} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import React, {useState} from "react";
import {useSettings} from "../hooks/settings";
import {stringifyName} from "../utils/transform";
import type {LevelDescriptor} from "../utils/types";
import {DimensionMenu} from "./MenuDimension";

export const ButtonSelectLevel = (props: ActionIconProps & {
  children: React.ReactNode;
  onItemSelect: React.ComponentProps<typeof DimensionMenu>["onItemSelect"];
  selectedItems: LevelDescriptor[];
}) => {
  const {selectedItems, onItemSelect, children, ...buttonProps} = props;
  const {maxHeightMenu} = useSettings();

  const theme = useMantineTheme();
  const isMediumScreen = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`);
  const [opened, setOpened] = useState(false);

  const handleItemSelect: typeof onItemSelect = (level, hierarchy, dimension) => {
    onItemSelect(level, hierarchy, dimension);
    setOpened(false);
  };

  const closeAll = () => setOpened(false);

  return (
    <>
      {/* Overlay that closes all menus when clicked */}
      {opened && 
        <Portal>
          <Box
            onClick={closeAll}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99,
              cursor: "default"
            }}
          />
        </Portal>
      }
      <Menu
        closeOnEscape
        closeOnClickOutside={false}
        position={isMediumScreen ? "left" : "right"}
        shadow="md"
        styles={{dropdown: {maxHeight: maxHeightMenu, overflowY: "auto", zIndex: 100}}}
        withArrow
        withinPortal
        opened={opened}
      >
        <Menu.Target>
          <ActionIcon {...buttonProps} onClick={() => setOpened(o => !o)}>{children}</ActionIcon>
        </Menu.Target>
        {opened && 
          <Menu.Dropdown>
            <DimensionMenu
              isMediumScreen={isMediumScreen}
              selectedItems={selectedItems.map(stringifyName)}
              onItemSelect={handleItemSelect}
              onCloseRoot={closeAll}
            />
          </Menu.Dropdown>
        }
      </Menu>
    </>
  );
};
