import {Accordion, Box, Flex, Group, Menu, Text, UnstyledButton} from "@mantine/core";
import {IconChevronRight, IconStack, IconStack2, IconStack3, IconStackMiddle} from "@tabler/icons-react";
import React, {useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useSettings} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectLocale} from "../state/queries";
import {selectOlapDimensionItems} from "../state/selectors";
import {abbreviateFullName} from "../utils/format";
import {getAnnotation, getCaption} from "../utils/string";
import {stringifyName} from "../utils/transform";

/**
 * @typedef {(level: import("@datawheel/olap-client").PlainLevel, hierarchy: import("@datawheel/olap-client").PlainHierarchy, dimension: import("@datawheel/olap-client").PlainDimension) => any} LvlHieDimCallback
 */

/** @type {string} */
const GROUP_ANNOTATION_KEY = "group";

/**
 * Groups items by a custom annotation key, with locale support.
 * @template {import("../utils/types").Annotated} T
 * @param {T[]} items
 * @param {string} locale
 * @param {string} annotationKey
 * @returns {{grouped: Map<string, T[]>, ungrouped: T[]}}
 */
function groupByAnnotation(items, locale, annotationKey = GROUP_ANNOTATION_KEY) {

  /** @type {Map<string, T[]>} */
  const grouped = new Map();

  /** @type {T[]} */
  const ungrouped = [];

  for (const item of items) {
    const groupLabel = getAnnotation(item, annotationKey, locale);
    if (groupLabel) {
      const group = grouped.get(groupLabel) || [];
      group.push(item);
      grouped.set(groupLabel, group);
    }
    else {
      ungrouped.push(item);
    }
  }

  return {grouped, ungrouped};
}

/**
 * @type {React.FC<{
 *  isMediumScreen?: boolean;
 *  onItemSelect: LvlHieDimCallback;
 *  selectedItems: string[];
 *  onCloseRoot?: () => void;
 * }>}
 */
export const DimensionMenu = props => {
  const dimensions = useSelector(selectOlapDimensionItems) || [];
  const locale = useSelector(selectLocale);

  // Track which nested menu is currently open
  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [openMenuUri, setOpenMenuUri] = useState(null);

  // Callback to close all nested menus and the root menu
  const closeAllMenus = () => {
    setOpenMenuUri(null);
    props.onCloseRoot?.();
  };

  const {nestedMenus, hierarchyMenus, accordionGroups, levelItems} = useMemo(() => {
    // Separate dimensions with multiple hierarchies (nested menus) from single-hierarchy ones
    const nested = dimensions.filter(dim => dim.hierarchies.length > 1);
    const flat = dimensions.filter(dim => dim.hierarchies.length === 1);

    // Group flat items by annotation
    const {grouped, ungrouped} = groupByAnnotation(flat, locale.code);

    // Further separate ungrouped into hierarchy menus (multiple levels) and level items (single level)
    const hierarchies = ungrouped.filter(dim => dim.hierarchies[0].levels.length > 1);
    const levels = ungrouped.filter(dim => dim.hierarchies[0].levels.length === 1);

    return {
      nestedMenus: nested,        // IconStack3
      hierarchyMenus: hierarchies, // IconStack2
      accordionGroups: grouped,    // IconStackMiddle
      levelItems: levels           // IconStack
    };
  }, [dimensions, locale.code]);

  return (
    <Menu>
      {/* 1. IconStack3 - Dimensions with multiple hierarchies */}
      {nestedMenus.map(dim =>
        <DimensionMenuItem
          dimension={dim}
          locale={locale.code}
          isMediumScreen={props.isMediumScreen}
          key={dim.uri}
          onItemSelect={props.onItemSelect}
          selectedItems={props.selectedItems}
          opened={openMenuUri === dim.uri}
          onOpenChange={opened => setOpenMenuUri(opened ? dim.uri : null)}
          onCloseAll={closeAllMenus}
        />
      )}

      {/* 2. IconStack2 - Single-hierarchy dimensions with multiple levels */}
      {hierarchyMenus.map(dim =>
        <DimensionMenuItem
          dimension={dim}
          locale={locale.code}
          isMediumScreen={props.isMediumScreen}
          key={dim.uri}
          onItemSelect={props.onItemSelect}
          selectedItems={props.selectedItems}
          opened={openMenuUri === dim.uri}
          onOpenChange={opened => setOpenMenuUri(opened ? dim.uri : null)}
          onCloseAll={closeAllMenus}
        />
      )}

      {/* 3. IconStackMiddle - Accordion groups */}
      {accordionGroups.size > 0 && 
        <Accordion
          multiple={false}
          chevronPosition="right"
          chevronSize={16}
          onChange={() => setOpenMenuUri(null)}
          styles={theme => ({
            item: {
              border: "none",
              backgroundColor: "transparent"
            },
            control: {
              "padding": `${theme.spacing.xs} ${theme.spacing.sm}`,
              "minHeight": "auto",
              "borderRadius": theme.radius.sm,
              "&:hover": {
                backgroundColor: theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[1]
              }
            },
            chevron: {
              marginLeft: theme.spacing.xs,
              width: 16,
              minWidth: 16
            },
            icon: {
              marginRight: theme.spacing.xs
            },
            label: {
              padding: 0
            },
            content: {
              padding: 0
            },
            panel: {
              padding: 0
            }
          })}
        >
          {[...accordionGroups.entries()].map(([groupLabel, groupDimensions]) =>
            <Accordion.Item key={groupLabel} value={groupLabel}>
              <Accordion.Control icon={<IconStackMiddle />}>
                <Text size="sm">{groupLabel}</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Flex ml={20} gap={0}>
                  <Box
                    w={2}
                    my={4}
                    sx={theme => ({
                      backgroundColor: theme.colorScheme === "dark"
                        ? theme.colors.dark[4]
                        : theme.colors.gray[4],
                      borderRadius: 1,
                      flexShrink: 0
                    })}
                  />
                  <Box sx={{flex: 1}}>
                    {groupDimensions.map(dim =>
                      <DimensionMenuItem
                        dimension={dim}
                        locale={locale.code}
                        isMediumScreen={props.isMediumScreen}
                        key={dim.uri}
                        onItemSelect={props.onItemSelect}
                        selectedItems={props.selectedItems}
                        opened={openMenuUri === dim.uri}
                        onOpenChange={opened => setOpenMenuUri(opened ? dim.uri : null)}
                        onCloseAll={closeAllMenus}
                      />
                    )}
                  </Box>
                </Flex>
              </Accordion.Panel>
            </Accordion.Item>
          )}
        </Accordion>
      }

      {/* 4. IconStack - Single-hierarchy dimensions with single level */}
      {levelItems.map(dim =>
        <DimensionMenuItem
          dimension={dim}
          locale={locale.code}
          isMediumScreen={props.isMediumScreen}
          key={dim.uri}
          onItemSelect={props.onItemSelect}
          selectedItems={props.selectedItems}
          onCloseAll={closeAllMenus}
        />
      )}
    </Menu>
  );
};


/**
 * @type {React.FC<{
 *  dimension: import("@datawheel/olap-client").PlainDimension;
 *  isMediumScreen?: boolean;
 *  locale: string;
 *  onItemSelect: LvlHieDimCallback;
 *  selectedItems: string[];
 *  opened?: boolean;
 *  onOpenChange?: (opened: boolean) => void;
 *  onCloseAll?: () => void;
 * }>}
 */
export const DimensionMenuItem = props => {
  const {dimension, locale, opened, onOpenChange, onCloseAll} = props;
  const {maxHeightMenu} = useSettings();

  const {translate: t} = useTranslation();

  // Track which child hierarchy menu is open
  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [openHierarchyUri, setOpenHierarchyUri] = useState(null);

  // Close all menus including local state
  const handleCloseAll = () => {
    setOpenHierarchyUri(null);
    onCloseAll?.();
  };

  const label = useMemo(() => t("params.dimmenu_dimension", {
    dimension: getCaption(dimension, locale)
  }), [locale, dimension]);

  const isChildSubMenu = dimension.hierarchies.length !== 1;

  // For single-hierarchy dimensions, pass through the controlled state from parent
  if (!isChildSubMenu) {
    return (
      <HierarchyMenuItem
        dimension={dimension}
        hierarchy={dimension.hierarchies[0]}
        isMediumScreen={props.isMediumScreen}
        isSubMenu={false}
        locale={locale}
        onItemSelect={props.onItemSelect}
        selectedItems={props.selectedItems}
        opened={opened}
        onOpenChange={onOpenChange}
        onCloseAll={handleCloseAll}
      />
    );
  }

  const options = dimension.hierarchies.map(hie =>
    <HierarchyMenuItem
      dimension={dimension}
      hierarchy={hie}
      isMediumScreen={props.isMediumScreen}
      isSubMenu={isChildSubMenu}
      key={hie.uri}
      locale={locale}
      onItemSelect={props.onItemSelect}
      selectedItems={props.selectedItems}
      opened={openHierarchyUri === hie.uri}
      onOpenChange={hieOpened => setOpenHierarchyUri(hieOpened ? hie.uri : null)}
      onCloseAll={handleCloseAll}
    />
  );

  return (
    <Menu
      key={dimension.uri}
      position={props.isMediumScreen ? "bottom" : "right"}
      shadow="md"
      styles={{dropdown: {maxHeight: maxHeightMenu, overflowY: "auto", zIndex: 100}}}
      closeOnItemClick
      closeOnClickOutside={false}
      withArrow
      withinPortal
      opened={opened}
      onClose={() => onOpenChange?.(false)}
    >
      <Menu.Target>
        <UnstyledButton
          component="div"
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            onOpenChange?.(!opened);
          }}
        >
          <Menu.Item
            icon={<IconStack3 />}
            sx={theme => ({
              [theme.fn.smallerThan("md")]: {
                maxWidth: 200
              }
            })}
          >
            <Group noWrap position="apart">
              <Text>{label}</Text>
              <IconChevronRight stroke={1.5} size={16} />
            </Group>
          </Menu.Item>
        </UnstyledButton>
      </Menu.Target>
      {opened && <Menu.Dropdown>
        <Menu>
          {options}
        </Menu>
      </Menu.Dropdown>}
    </Menu>
  );
};

/**
 * @type {React.FC<{
 *  dimension: import("@datawheel/olap-client").PlainDimension;
 *  hierarchy: import("@datawheel/olap-client").PlainHierarchy;
 *  isMediumScreen?: boolean;
 *  isSubMenu?: boolean;
 *  locale: string;
 *  onItemSelect: LvlHieDimCallback;
 *  selectedItems: string[];
 *  opened?: boolean;
 *  onOpenChange?: (opened: boolean) => void;
 *  onCloseAll?: () => void;
 * }>}
 */
export const HierarchyMenuItem = props => {
  const {dimension, hierarchy, locale, onItemSelect, selectedItems, opened, onOpenChange, onCloseAll} = props;
  const {maxHeightMenu} = useSettings();

  const {translate: t} = useTranslation();

  const label = useMemo(() => {
    const captions = [getCaption(dimension, locale), getCaption(hierarchy, locale)];
    if (props.isSubMenu) {
      return captions[1];
    }
    return t("params.dimmenu_hierarchy", {
      abbr: abbreviateFullName(captions, t("params.dimmenu_abbrjoint")),
      dimension: captions[0],
      hierarchy: captions[1]
    });
  }, [locale, dimension, hierarchy, props.isSubMenu]);

  const isChildSubMenu = hierarchy.levels.length !== 1;

  // Group levels by annotation when there are multiple levels
  const {accordionGroups, individualItems} = useMemo(() => {
    if (!isChildSubMenu) {
      return {accordionGroups: new Map(), individualItems: []};
    }

    const {grouped, ungrouped} = groupByAnnotation(hierarchy.levels, locale);

    return {
      accordionGroups: grouped,
      individualItems: ungrouped
    };
  }, [hierarchy.levels, locale, isChildSubMenu]);

  if (!isChildSubMenu) {
    return (
      <LevelMenuItem
        dimension={dimension}
        hierarchy={hierarchy}
        isSubMenu={false}
        level={hierarchy.levels[0]}
        locale={locale}
        onItemSelect={onItemSelect}
        onCloseAll={onCloseAll}
        selectedItems={selectedItems}
      />
    );
  }

  return (
    <Menu
      key={hierarchy.uri}
      position={props.isMediumScreen ? "bottom" : "right"}
      shadow="md"
      styles={{dropdown: {maxHeight: maxHeightMenu, overflowY: "auto", zIndex: 100}}}
      closeOnItemClick
      closeOnClickOutside={false}
      withArrow
      withinPortal
      opened={opened}
      onClose={() => onOpenChange?.(false)}
    >
      <Menu.Target>
        <UnstyledButton
          component="div"
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            onOpenChange?.(!opened);
          }}
        >
          <Menu.Item
            icon={<IconStack2 />}
            sx={theme => ({
              [theme.fn.smallerThan("md")]: {
                maxWidth: 200
              }
            })}
          >
            <Group noWrap position="apart">
              <Text>{label}</Text>
              <IconChevronRight stroke={1.5} size={16} />
            </Group>
          </Menu.Item>
        </UnstyledButton>
      </Menu.Target>
      {opened && <Menu.Dropdown>
        <Menu>
          {/* Accordion groups for levels */}
          {accordionGroups.size > 0 && 
            <div onClick={e => e.stopPropagation()}>
              <Accordion
                multiple={false}
                chevronPosition="right"
                chevronSize={16}
                styles={theme => ({
                  item: {
                    border: "none",
                    backgroundColor: "transparent"
                  },
                  control: {
                    "padding": `${theme.spacing.xs} ${theme.spacing.sm}`,
                    "minHeight": "auto",
                    "borderRadius": theme.radius.sm,
                    "&:hover": {
                      backgroundColor: theme.colorScheme === "dark"
                        ? theme.colors.dark[4]
                        : theme.colors.gray[1]
                    }
                  },
                  chevron: {
                    marginLeft: theme.spacing.xs,
                    width: 16,
                    minWidth: 16
                  },
                  icon: {
                    marginRight: theme.spacing.xs
                  },
                  label: {
                    padding: 0
                  },
                  content: {
                    padding: 0
                  },
                  panel: {
                    padding: 0
                  }
                })}
              >
                {[...accordionGroups.entries()].map(([groupLabel, groupLevels]) =>
                  <Accordion.Item key={groupLabel} value={groupLabel}>
                    <Accordion.Control icon={<IconStackMiddle />}>
                      <Text size="sm">{groupLabel}</Text>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Flex ml={20} gap={0}>
                        <Box
                          w={2}
                          my={4}
                          sx={theme => ({
                            backgroundColor: theme.colorScheme === "dark"
                              ? theme.colors.dark[4]
                              : theme.colors.gray[4],
                            borderRadius: 1,
                            flexShrink: 0
                          })}
                        />
                        <Box sx={{flex: 1}}>
                          {groupLevels.map(lvl =>
                            <LevelMenuItem
                              dimension={dimension}
                              hierarchy={hierarchy}
                              isSubMenu
                              key={lvl.uri}
                              level={lvl}
                              locale={locale}
                              onItemSelect={onItemSelect}
                              selectedItems={selectedItems}
                              onCloseAll={onCloseAll}
                            />
                          )}
                        </Box>
                      </Flex>
                    </Accordion.Panel>
                  </Accordion.Item>
                )}
              </Accordion>
            </div>
          }

          {/* Individual level items */}
          {individualItems.map(lvl =>
            <LevelMenuItem
              dimension={dimension}
              hierarchy={hierarchy}
              isSubMenu
              key={lvl.uri}
              level={lvl}
              locale={locale}
              onItemSelect={onItemSelect}
              selectedItems={selectedItems}
              onCloseAll={onCloseAll}
            />
          )}
        </Menu>
      </Menu.Dropdown>}
    </Menu>
  );
};

/**
 * @type {React.FC<{
 *  dimension: import("@datawheel/olap-client").PlainDimension;
 *  hierarchy: import("@datawheel/olap-client").PlainHierarchy;
 *  isSubMenu?: boolean;
 *  level: import("@datawheel/olap-client").PlainLevel;
 *  locale: string;
 *  onItemSelect: LvlHieDimCallback;
 *  selectedItems: string[];
 *  onCloseAll?: () => void;
 * }>}
 */
export const LevelMenuItem = props => {
  const {dimension, hierarchy, level, locale, onCloseAll} = props;

  const {translate: t} = useTranslation();

  const label = useMemo(() => {
    const captions = [
      getCaption(dimension, locale),
      getCaption(hierarchy, locale),
      getCaption(level, locale)
    ];
    if (props.isSubMenu) {
      return captions[2];
    }
    return t("params.dimmenu_level", {
      abbr: abbreviateFullName(captions, t("params.dimmenu_abbrjoint")),
      dimension: captions[0],
      hierarchy: captions[1],
      level: captions[2]
    });
  }, [locale, dimension, hierarchy, level, props.isSubMenu]);

  return (
    <Menu.Item
      disabled={props.selectedItems.includes(stringifyName(level))}
      icon={<IconStack />}
      key={level.uri}
      miw={200}
      onClick={() => {
        props.onItemSelect(level, hierarchy, dimension);
        onCloseAll?.();
      }}
      sx={theme => ({
        [theme.fn.smallerThan("md")]: {
          maxWidth: 200
        }
      })}
    >
      {label}
    </Menu.Item>
  );
};
