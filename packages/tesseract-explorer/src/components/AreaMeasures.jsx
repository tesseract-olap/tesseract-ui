import {ActionIcon, Checkbox, CloseButton, Input, Popover, Stack} from "@mantine/core";
import {IconFilter, IconFilterOff, IconSearch, IconTrashX} from "@tabler/icons-react";
import React, {useCallback, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useActions} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectLocale, selectMeasureMap} from "../state/queries";
import {selectOlapMeasureItems, selectOlapMeasureMap} from "../state/selectors";
import {filterMap} from "../utils/array";
import {getCaption} from "../utils/string";
import {buildMeasure} from "../utils/structs";
import {keyBy, safeRegExp} from "../utils/transform";
import {isActiveItem} from "../utils/validation";
import {LayoutParamsArea} from "./LayoutParamsArea";

/**
 * Renders the block to select a Measure from the currently selected cube.
 */
export function AreaMeasures() {
  const actions = useActions();

  const {code: locale} = useSelector(selectLocale);
  const itemMap = useSelector(selectMeasureMap);
  const measureMap = useSelector(selectOlapMeasureMap);
  const measures = useSelector(selectOlapMeasureItems);

  const [filter, setFilter] = useState("");

  const {translate: t} = useTranslation();

  const filteredItems = useMemo(() => {
    const query = filter ? safeRegExp(filter, "i") : null;
    return filterMap(measures, measure => {
      if (query && !query.test(getCaption(measure, locale))) {
        return null;
      }
      return itemMap[measure.name] || buildMeasure({active: false, ...measure});
    });
  }, [itemMap, measures, filter, locale]);

  const activeItems = filteredItems.filter(isActiveItem);

  const measureNodes = useMemo(() => filteredItems.map(item => {
    const measure = measureMap[item.name];
    return <Checkbox
      key={item.key}
      checked={item.active}
      label={getCaption(measure, locale)}
      onChange={() => {
        actions.updateMeasure({...item, active: !item.active});
      }}
    />;
  }), [filteredItems, measureMap]);

  const resetActive = useCallback(() => {
    const nextMeasures = measures.map(item => ({
      ...itemMap[item.name],
      active: false
    }));
    actions.resetMeasures(keyBy(nextMeasures, "key"));
  }, [itemMap, measures]);

  const resetFilter = useCallback(() => setFilter(""), []);

  const toolbar =
    <>
      {activeItems.length > 0 &&
        <ActionIcon onClick={resetActive} variant="subtle">
          <IconTrashX />
        </ActionIcon>}
      <Popover
        closeOnClickOutside
        closeOnEscape
        position="bottom"
        shadow="md"
        trapFocus
        withArrow
        withinPortal
      >
        <Popover.Target>
          <ActionIcon variant="subtle">
            {filter ? <IconFilterOff onClick={resetFilter} /> : <IconFilter />}
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Input
            icon={<IconSearch />}
            onChange={evt => setFilter(evt.target.value)}
            placeholder={t("params.search_placeholder")}
            rightSection={
              filter.length > 0
                ? <CloseButton onClick={resetFilter} />
                : undefined
            }
            type="search"
            value={filter}
          />
        </Popover.Dropdown>
      </Popover>
    </>;

  return (
    <LayoutParamsArea
      id="measures"
      title={t("params.title_area_measures", {n: activeItems.length})}
      toolbar={toolbar}
      tooltip={t("params.tooltip_area_measures")}
      value="measures"
    >
      <Stack spacing="xs">
        {measureNodes}
      </Stack>
    </LayoutParamsArea>
  );
}
