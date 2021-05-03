import {ControlGroup, FormGroup} from "@blueprintjs/core";
import React, {memo, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SelectObject} from "../components/Select";
import {useTranslation} from "../hooks/translation";
import {doSortingUpdate} from "../state/params/actions";
import {selectSortingParams} from "../state/params/selectors";
import {shallowEqualForProps} from "../utils/validation";
import {MemoSelectMeasure as SelectMeasure} from "./SelectMeasure";

/** @type {React.FC<import("../components/Select").SelectObjectProps<{value: string, label: string}>>} */
const SelectDirection = memo(SelectObject, shallowEqualForProps("items", "selectedItem"));

/**
 * @typedef SortingInputProps
 * @property {string} [className]
 */

/** @type {React.FC<SortingInputProps>} */
export const SortingInput = () => {
  const dispatch = useDispatch();

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

  return (
    <FormGroup label={t("params.label_sorting_key")}>
      <ControlGroup fill={true}>
        <SelectMeasure
          fill={true}
          icon={sortKey ? "timeline-bar-chart" : false}
          selectedItem={sortKey}
          onItemSelect={measure => dispatch(doSortingUpdate(measure.name, sortDir))}
        />
        <SelectDirection
          getLabel={item => item.label}
          items={sort.options}
          onItemSelect={direction => dispatch(doSortingUpdate(sortKey, direction.value))}
          selectedItem={sort.directions[sortDir]}
        />
      </ControlGroup>
    </FormGroup>
  );
};
