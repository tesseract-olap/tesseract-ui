import {PlainMeasure} from "@datawheel/olap-client";
import {Group, Input} from "@mantine/core";
import React, {useCallback, useMemo} from "react";
import {useSelector} from "react-redux";
import {useActions} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectSortingParams} from "../state/queries";
import {SelectObject} from "./Select";
import {MemoSelectMeasure as SelectMeasure} from "./SelectMeasure";

type DirectionOptions = {label: string, value: "asc" | "desc"};

/** */
export function SortingInput() {
  const actions = useActions();
  const {locale, translate: t} = useTranslation();

  const {sortDir, sortKey} = useSelector(selectSortingParams);

  const sort = useMemo(() => {
    const directions = {
      asc: t("direction.ASC"),
      desc: t("direction.DESC")
    };
    const options: DirectionOptions[] = [
      {value: "asc", label: directions.asc},
      {value: "desc", label: directions.desc}
    ];
    return {directions, options};
  }, [locale]);

  const measureChangeHandler = useCallback((measure: PlainMeasure) => {
    actions.updateSorting({key: measure.name, dir: sortDir});
  }, []);

  const directionChangeHandler = useCallback((direction: DirectionOptions) => {
    actions.updateSorting({key: sortKey, dir: direction.value});
  }, []);

  return (
    <Input.Wrapper label={t("params.label_sorting_key")}>
      <Group noWrap spacing="xs" align="end">
        <SelectMeasure
          activeOnly
          selectedItem={sortKey}
          onItemSelect={measureChangeHandler}
        />
        <SelectObject
          getValue="value"
          getLabel="label"
          items={sort.options}
          onItemSelect={directionChangeHandler}
          selectedItem={sortDir}
          searchable={false}
        />
      </Group>
    </Input.Wrapper>
  );
}
