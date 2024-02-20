import {Group, Input} from "@mantine/core";
import React, {memo, useCallback, useMemo} from "react";
import {useSelector} from "react-redux";
import {SelectObject} from "../components/Select";
import {useActions} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectSortingParams} from "../state/queries";
import {shallowEqualForProps} from "../utils/validation";
import {MemoSelectMeasure as SelectMeasure} from "./SelectMeasure";

/** @type {React.FC<import("../components/Select").SelectObjectProps<{value: string, label: string}>>} */
const SelectDirection = memo(SelectObject, shallowEqualForProps("items", "selectedItem"));

export const SortingInput = () => {
  const actions = useActions();

  const {locale, translate: t} = useTranslation();

  const {sortDir, sortKey} = useSelector(selectSortingParams);

  const sort = useMemo(() => {
    const directions = {
      asc: t("direction.ASC"),
      desc: t("direction.DESC")
    };
    const options = [
      {value: "asc", label: directions.asc},
      {value: "desc", label: directions.desc}
    ];
    return {directions, options};
  }, [locale]);

  /** @type {(item: import("@datawheel/olap-client").PlainMeasure) => void} */
  const measureChangeHandler = useCallback(measure => {
    actions.updateSorting({key: measure.name, dir: sortDir});
  }, []);

  /** @type {(item: {label: string; value: "asc" | "desc"}) => void} */
  const directionChangeHandler = useCallback(direction => {
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
        <SelectDirection
          getKey={item => item.value}
          getLabel={item => item.label}
          items={sort.options}
          onItemSelect={directionChangeHandler}
          selectedItem={sortDir}
          searchable={false}
        />
      </Group>
    </Input.Wrapper>
  );
};
