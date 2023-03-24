import {Group, Menu, Text, UnstyledButton, useMantineTheme} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {IconChevronRight, IconStack, IconStack2, IconStack3} from "@tabler/icons-react";
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {selectLocale} from "../state/params/selectors";
import {selectOlapDimensionItems} from "../state/selectors";
import {abbreviateFullName} from "../utils/format";
import {getCaption} from "../utils/string";
import {stringifyName} from "../utils/transform";

/**
 * @typedef {(level: OlapClient.PlainLevel, hierarchy: OlapClient.PlainHierarchy, dimension: OlapClient.PlainDimension) => any} LvlHieDimCallback
 */

/**
 * @type {React.FC<{
 *  isMediumScreen?: boolean;
 *  onItemSelect: LvlHieDimCallback;
 *  selectedItems: string[];
 * }>}
 */
export const DimensionMenu = props => {
  const dimensions = useSelector(selectOlapDimensionItems) || [];
  const locale = useSelector(selectLocale);

  const options = useMemo(() => dimensions.map(dim =>
    <DimensionMenuItem
      dimension={dim}
      locale={locale.code}
      isMediumScreen={props.isMediumScreen}
      key={dim.uri}
      onItemSelect={props.onItemSelect}
      selectedItems={props.selectedItems}
    />
  ), [dimensions, props.selectedItems, props.onItemSelect]);

  return <Menu>{options}</Menu>;
};


/**
 * @type {React.FC<{
 *  dimension: OlapClient.PlainDimension;
 *  isMediumScreen?: boolean;
 *  locale: string;
 *  onItemSelect: LvlHieDimCallback;
 *  selectedItems: string[];
 * }>}
 */
export const DimensionMenuItem = props => {
  const {dimension, locale} = props;

  const {translate: t} = useTranslation();

  const label = useMemo(() => t("params.dimmenu_dimension", {
    dimension: getCaption(dimension, locale)
  }), [locale, dimension]);

  const isChildSubMenu = dimension.hierarchies.length !== 1;

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
    />
  );

  if (!isChildSubMenu) {
    return options[0];
  }

  return (
    <Menu
      key={dimension.uri}
      position={props.isMediumScreen ? "bottom" : "right"}
      shadow="md"
      withArrow
    >
      <Menu.Target>
        <UnstyledButton component="div">
          <Menu.Item 
            icon={<IconStack3 />}
            sx={(theme) => ({
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
      <Menu.Dropdown>
        <Menu>
          {options}
        </Menu>
      </Menu.Dropdown>
    </Menu>
  );
};

/**
 * @type {React.FC<{
 *  dimension: OlapClient.PlainDimension;
 *  hierarchy: OlapClient.PlainHierarchy;
 *  isMediumScreen?: boolean;
 *  isSubMenu?: boolean;
 *  locale: string;
 *  onItemSelect: LvlHieDimCallback;
 *  selectedItems: string[];
 * }>}
 */
export const HierarchyMenuItem = props => {
  const {dimension, hierarchy, locale, onItemSelect, selectedItems} = props;

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

  const options = hierarchy.levels.map(lvl =>
    <LevelMenuItem
      dimension={dimension}
      hierarchy={hierarchy}
      isSubMenu={isChildSubMenu}
      key={lvl.uri}
      level={lvl}
      locale={locale}
      onItemSelect={onItemSelect}
      selectedItems={selectedItems}
    />
  );

  if (!isChildSubMenu) {
    return options[0];
  }

  return (
    <Menu
      key={hierarchy.uri}
      position={props.isMediumScreen ? "bottom" : "right"}
      shadow="md"
      withArrow
    >
      <Menu.Target>
        <UnstyledButton component="div">
          <Menu.Item 
            icon={<IconStack2 />}
            sx={(theme) => ({
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
      <Menu.Dropdown>
        <Menu>
          {options}
        </Menu>
      </Menu.Dropdown>
    </Menu>
  );
};

/**
 * @type {React.FC<{
 *  dimension: OlapClient.PlainDimension;
 *  hierarchy: OlapClient.PlainHierarchy;
 *  isSubMenu?: boolean;
 *  level: OlapClient.PlainLevel;
 *  locale: string;
 *  onItemSelect: LvlHieDimCallback;
 *  selectedItems: string[];
 * }>}
 */
export const LevelMenuItem = props => {
  const {dimension, hierarchy, level, locale} = props;

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
      onClick={() => props.onItemSelect(level, hierarchy, dimension)}
      sx={(theme) => ({
        [theme.fn.smallerThan("md")]: {
          maxWidth: 200
        }
      })}
    >
      {label}
    </Menu.Item>
  );
};
