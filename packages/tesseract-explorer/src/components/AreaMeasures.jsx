import {Checkbox, CloseButton, Input, Popover, Stack, ThemeIcon} from "@mantine/core";
import {IconFilter, IconFilterOff, IconSearch} from "@tabler/icons-react";
import React, {useCallback, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doMeasureToggle} from "../state/params/actions";
import {selectLocale, selectMeasureItems} from "../state/params/selectors";
import {selectOlapMeasureItems} from "../state/selectors";
import {getCaption} from "../utils/string";
import {safeRegExp} from "../utils/transform";
import {LayoutParamsArea} from "./LayoutParamsArea";

/** @type {React.FC} */
export const AreaMeasures = () => {
  const dispatch = useDispatch();

  const {code: locale} = useSelector(selectLocale);
  const items = useSelector(selectMeasureItems);
  const measures = useSelector(selectOlapMeasureItems);

  const [filter, setFilter] = useState("");

  const {translate: t} = useTranslation();

  const filteredItems = useMemo(() => {
    if (filter) {
      const query = safeRegExp(filter, "i");
      return measures.filter(item => query.test(getCaption(item, locale)));
    }
    return measures;
  }, [measures, filter]);

  const resetFilter = useCallback(() => setFilter(""), []);
  const toolbar =
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
        <ThemeIcon color={filter ? "red" : "blue"} variant="light">
          {filter ? <IconFilterOff onClick={resetFilter} /> : <IconFilter />}
        </ThemeIcon>
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
    </Popover>;

  return (
    <LayoutParamsArea
      id="measures"
      title={t("params.title_area_measures", {n: items.length})}
      toolbar={toolbar}
      tooltip={t("params.tooltip_area_measures")}
      value="measures"
    >
      <Stack spacing="xs">
        {filteredItems.map(item =>
          <Checkbox
            checked={items.includes(item.name)}
            key={item.name}
            label={getCaption(item, locale)}
            onChange={() => {
              dispatch(doMeasureToggle(item.name));
            }}
          />
        )}
      </Stack>
    </LayoutParamsArea>
  );
};
