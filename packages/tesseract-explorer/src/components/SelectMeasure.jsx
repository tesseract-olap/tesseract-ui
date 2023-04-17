import {Select} from "@mantine/core";
import React, {memo, useMemo} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {selectOlapMeasureItems} from "../state/selectors";
import {shallowEqualExceptFns} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {(item: import("@datawheel/olap-client").PlainMeasure) => void} onItemSelect
 * @property {string} [placeholder]
 * @property {string | undefined} selectedItem
 */

/** @type {React.FC<OwnProps>} */
export const SelectMeasure = props => {
  const {translate: t} = useTranslation();

  const items = useSelector(selectOlapMeasureItems).map(item => ({
    ...item,
    label: item.name,
    value: item.name
  }));

  const objectItems = useMemo(() => {
    const formattedItems = {};

    items.forEach(item => {
      formattedItems[item.value] = item;
    });

    return formattedItems;

  }, [items]);

  return (
    <Select
      data={items}
      onChange={value => props.onItemSelect(objectItems[value])}
      placeholder={t("selectmeasure_placeholder")}
      searchable={items.length > 6}
    />
  );
};

export const MemoSelectMeasure = memo(SelectMeasure, shallowEqualExceptFns);
