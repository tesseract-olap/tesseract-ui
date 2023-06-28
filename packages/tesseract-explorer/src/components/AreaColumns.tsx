import {Box, Checkbox, Input} from "@mantine/core";
import {IconToggleLeft, IconToggleRight} from "@tabler/icons-react";
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {useActions} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectDimensionItems, selectLocale, selectMeasurementItems} from "../state/queries";
import {selectOlapDimensionMap, selectOlapMeasureMap} from "../state/selectors";
import {filterMap} from "../utils/array";
import {getCaption} from "../utils/string";
import {activeItemCounter} from "../utils/validation";
import {ColumnItem} from "./ColumnItem";

/**
 *
 */
export function AreaColumns(props: {}) {
  const actions = useActions();
  const {t} = useTranslation();
  const {code: locale} = useSelector(selectLocale);

  const olapDim = useSelector(selectOlapDimensionMap);
  const olapMsr = useSelector(selectOlapMeasureMap);
  const queryDim = useSelector(selectDimensionItems);
  const queryMsr = useSelector(selectMeasurementItems);

  const activeMeasures = Object.values(queryMsr).reduce(
    (sum, item) => sum + (item.isMeasureActive ? 1 : 0), 0);
  const activeDimensions = Object.values(queryDim).reduce(
    (sum, item) => sum + (item.isDrilldownActive ? 1 : 0), 0);

  const measures = useMemo(() => filterMap(queryMsr, item => {
    const measure = olapMsr[item.measure];
    if (!measure) return null;

    const props = {
      key: item.key,
      name: measure.name,
      joint: item.joint
    };
    const conditionOne = parseCondition(item.conditionOne);
    const conditionTwo = parseCondition(item.conditionTwo);

    return (
      <ColumnItem
        key={item.key}
        label={
          getCaption(measure, locale)
        }
        icon={
          <Checkbox
            key={item.key}
            checked={item.isMeasureActive}
            onChange={() => {
              actions.updateMeasurement({
                ...item,
                isMeasureActive: !item.isMeasureActive
              });
            }}
          />}
      />
    );
  }), [olapMsr, queryMsr]);

  const dimensions = useMemo(() => filterMap(queryDim, item => {
    const level = olapDim[item.level];
    return ();
  }), [olapDim, queryDim]);

  return (
    <>
      <Input.Wrapper label={t("params.title_area_msrcols", {n: `${activeMeasures}`})}>
        {measures}
      </Input.Wrapper>
      <Input.Wrapper label={t("params.title_area_dimcols", {n: `${activeDimensions}`})}>
        {dimensions}
      </Input.Wrapper>
    </>
  );
}

/** */
function parseCondition(cond: undefined | [string, string, string]) {
  return null;
}
