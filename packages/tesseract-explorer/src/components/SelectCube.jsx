import {Box, Stack} from "@mantine/core";
import React, {memo, useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {willSetCube} from "../middleware/olapActions";
import {selectLocale} from "../state/params/selectors";
import {selectOlapCube} from "../state/selectors";
import {selectOlapCubeItems} from "../state/server/selectors";
import {getAnnotation, getCaption} from "../utils/string";
import {groupBy} from "../utils/transform";
import {shallowEqualForProps} from "../utils/validation";
import {MemoCubeDescription, MemoCubeSource} from "./CubeMetadata";
import {SelectWithButtons} from "./SelectWithButtons";

/** @type {React.FC<import("./SelectWithButtons").OwnProps<string>>} */
const SelectLevel = memo(SelectWithButtons, shallowEqualForProps("items", "selectedItem"));

/** @type {React.FC<import("./SelectWithButtons").OwnProps<OlapClient.PlainCube>>} */
const SelectPlainCube = memo(SelectWithButtons, shallowEqualForProps("items", "selectedItem"));

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
export const SelectCube = () => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();
  const {code: locale} = useSelector(selectLocale);

  const items = useSelector(selectOlapCubeItems);
  const selectedItem = useSelector(selectOlapCube);

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

  /** @type {(cube: import("@datawheel/olap-client").PlainCube) => void} */
  const onItemSelect = useCallback(cube => {
    dispatch(willSetCube(cube.name));
  }, []);

  // We need to keep the selectedItem in sync if at some point the
  // user selection leaves it out of the final subset of options
  useEffect(() => {
    if (selectedItem && cubeItems.length > 0 && !cubeItems.includes(selectedItem)) {
      onItemSelect(cubeItems[0]);
    }
  }, [cubeItems, selectedItem]);

  const selectCube = selectedItem
    ? <SelectPlainCube
      getLabel={item => getCaption(item, locale)}
      hidden={cubeItems.length < 2}
      items={cubeItems}
      label={t("params.label_cube")}
      onItemSelect={onItemSelect}
      searchable
      selectedItem={selectedItem}
    />
    : null;

  return (
    <Box>
      <Stack spacing={0}>
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
        {selectCube}
      </Stack>
      {selectedItem && <MemoCubeDescription
        cube={selectedItem}
      />}
      {selectedItem && <MemoCubeSource
        cube={selectedItem}
      />}
    </Box>
  );
};

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
 * @template T
 * @param {T[]} items The list of items to to select from.
 * @param {T | undefined} currentItem The currently selected item, must belong to the `items` array.
 * @param {(item: T) => string | null | undefined} accessor A function to select a item's property, whose value will be used a filtering step
 * @param {string[]} [dependencies]
 */
function useSyncedSubset(items, currentItem, accessor, dependencies = []) {
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
