import {type PlainCube} from "@datawheel/olap-client";
import {Anchor, Stack, Text, TextProps} from "@mantine/core";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useActions} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectLocale} from "../state/queries";
import {selectOlapCube} from "../state/selectors";
import {selectOlapCubeItems} from "../state/server";
import {getAnnotation, getCaption} from "../utils/string";
import {groupBy} from "../utils/transform";
import {Annotated} from "../utils/types";
import {SelectWithButtons} from "./Select";

const SelectLevel = SelectWithButtons<string>;
const SelectPlainCube = SelectWithButtons<PlainCube>;

/** */
export function SelectCube() {
  const items = useSelector(selectOlapCubeItems);
  const selectedItem = useSelector(selectOlapCube);

  if (items.length === 1) {
    return null;
  }

  return <SelectCubeInternal items={items} selectedItem={selectedItem} />;
}

/** */
function SelectCubeInternal(props: {
  items: PlainCube[];
  selectedItem: PlainCube | undefined;
}) {
  const {items, selectedItem} = props;

  const actions = useActions();

  const onItemSelect = useCallback((cube: PlainCube) => {
    actions.willSetCube(cube.name);
  }, []);

  const {translate: t} = useTranslation();
  const {code: locale} = useSelector(selectLocale);

  // Each level limits the available cubes for the next level
  const {
    level: level1,
    setLevel: setLevel1,
    keys: level1Keys,
    values: level1Values
  } = useSyncedSubset(
    items, selectedItem,
    item => getAnnotation(item, "topic", locale),
    [locale]
  );

  const {
    level: level2,
    setLevel: setLevel2,
    keys: level2Keys,
    values: level2Values
  } = useSyncedSubset(
    level1Values, selectedItem,
    item => getAnnotation(item, "subtopic", locale),
    [locale]
  );

  const {
    level: level3,
    setLevel: setLevel3,
    keys: level3Keys,
    values: level3Values
  } = useSyncedSubset(
    level2Values, selectedItem,
    item => getAnnotation(item, "table", locale),
    [locale]
  );

  // The list available to the last selector is the one that contains any item.
  /* eslint-disable indent, operator-linebreak */
  const cubeItems =
    level3Values.length > 0 ? level3Values :
    level2Values.length > 0 ? level2Values :
    level1Values.length > 0 ? level1Values :
    /* else */                items;
  /* eslint-enable indent, operator-linebreak */

  // We need to keep the selectedItem in sync if at some point the
  // user selection leaves it out of the final subset of options
  useEffect(() => {
    if (selectedItem && cubeItems.length > 0 && !cubeItems.includes(selectedItem)) {
      onItemSelect(cubeItems[0]);
    }
  }, [cubeItems, selectedItem]);

  return (
    <Stack id="select-cube" spacing={0}>
      <SelectLevel
        hidden={level1 === "Hidden"}
        items={level1Keys}
        label={t("params.label_topic")}
        onItemSelect={setLevel1}
        selectedItem={level1}
      />
      <SelectLevel
        hidden={level2 === "Hidden"}
        items={level2Keys}
        label={t("params.label_subtopic")}
        onItemSelect={setLevel2}
        selectedItem={level2}
      />
      <SelectLevel
        hidden={level3 === "Hidden"}
        items={level3Keys}
        label={t("params.label_table")}
        onItemSelect={setLevel3}
        selectedItem={level3}
      />
      {<SelectPlainCube
        hidden={cubeItems.length < 2}
        getLabel={item => getCaption(item, locale)}
        getValue="name"
        items={cubeItems}
        label={t("params.label_cube")}
        onItemSelect={onItemSelect}
        selectedItem={selectedItem}
      />}
      {selectedItem && <Text mt="sm" sx={{"& p": {margin: 0}}}>
        <CubeAnnotation
          annotation="description"
          className="dex-cube-description"
          item={selectedItem}
          locale={locale}
        />
        <CubeSourceAnchor
          item={selectedItem}
          locale={locale}
          fz="xs"
        />
        <CubeAnnotation
          annotation="source_description"
          className="dex-cube-srcdescription"
          fz="xs"
          item={selectedItem}
          locale={locale}
        />
      </Text>}
    </Stack>
  );
}

/** */
function CubeAnnotation(props: TextProps & {
  annotation: string;
  item: Annotated;
  locale: string;
}) {
  const {annotation, item, locale, ...textProps} = props;
  const content = getAnnotation(item, annotation, locale);
  return content
    ? <Text component="p" {...textProps}>{content}</Text>
    : null;
}

/** */
function CubeSourceAnchor(props: TextProps & {
  item: Annotated;
  locale: string;
}) {
  const {item, locale, ...textProps} = props;
  const {translate: t} = useTranslation();

  const srcName = getAnnotation(item, "source_name", locale);
  const srcLink = getAnnotation(item, "source_link", locale);

  if (!srcName) return null;

  return (
    <Text component="p" {...textProps}>
      {`${t("params.label_source")}: `}
      {srcLink
        ? <Anchor href={srcLink}>{srcName}</Anchor>
        : <Text span>{srcName}</Text>}
    </Text>
  );
}

/**
 * Keeps the state for the selector at that level, and limits the values passed
 * to the next one depending on this state.
 *
 * The returned object contains the following properties:
 * - `level`: The value selected by the user for this level of filtering.
 * - `setLevel`: The dispatcher function to change the value of `level`.
 * - `keys`: An array containing the possible values returned by the accessor
 * for all the available `items`.
 * - `values`: The subset of `items`, whose `accessor(item)` matches the `level`
 * selected by the user.
 *
 * Initially `level` is the value obtained from `accessor(currentItem)`.
 * Afterwards it's recalculated and updated each time `currentItem` changes.
 * Properties `level` and `setLevel` come from a `useState` hook, and can be
 * treated as such.
 * If the accessor function returns `undefined` for all items, both `keys` and
 * `values` in the returned object will be empty.
 *
 * @param items
 * The list of items to to select from.
 * @param currentItem
 * The currently selected item, must belong to the `items` array.
 * @param accessor
 * The value returned by this function will be used as filtering step
 * @param dependencies
 * Manual dependencies to declare for internal calculation.
 */
function useSyncedSubset<T>(
  items: T[],
  currentItem: T | undefined,
  accessor: (item: T) => string | null | undefined,
  dependencies: string[] = []
) {
  const [level, setLevel] = useState(() => currentItem && accessor(currentItem) || "");

  useEffect(() => {
    currentItem && setLevel(accessor(currentItem) || "");
  }, [currentItem, ...dependencies]);

  const [keys, values] = useMemo(() => {
    const tree = groupBy(items, accessor);
    const keys = [...tree.keys()];
    const values = tree.get(level) || [];
    return [keys, values];
  }, [items, level, ...dependencies]);

  return {level, setLevel, keys, values};
}
