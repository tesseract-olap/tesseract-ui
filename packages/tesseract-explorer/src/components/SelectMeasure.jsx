import {Select} from "@mantine/core";
import React, {memo, useMemo} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {selectMeasureMap} from "../state/queries";
import {selectOlapMeasureItems} from "../state/selectors";
import {filterMap} from "../utils/array";
import {keyBy} from "../utils/transform";
import {isActiveItem, shallowEqualExceptFns} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {boolean} [activeOnly]
 * @property {(item: import("@datawheel/olap-client").PlainMeasure) => void} onItemSelect
 * @property {string} [placeholder]
 * @property {string | undefined} selectedItem
 */

/** @type {React.FC<OwnProps>} */
export const SelectMeasure = props => {
  const {activeOnly, onItemSelect} = props;

  const {translate: t} = useTranslation();

  const measures = useSelector(selectOlapMeasureItems);
  const measureMap = useSelector(selectMeasureMap);

  const [itemList, changeHandler] = useMemo(() => {
    const list = filterMap(measures, item => {
      const {name} = item;
      if (activeOnly && !isActiveItem(measureMap[name])) return null;
      return {item, label: name, value: name};
    });

    const map = keyBy(list, item => item.value);
    const callback = value => {
      if (value && onItemSelect) onItemSelect(map[value].item);
    };

    return [list, callback];
  }, [measureMap, onItemSelect]);

  return (
    <Select
      data={itemList}
      onChange={changeHandler}
      placeholder={t("selectmeasure_placeholder")}
      searchable={itemList.length > 6}
    />
  );
};

export const MemoSelectMeasure = memo(SelectMeasure, shallowEqualExceptFns);
