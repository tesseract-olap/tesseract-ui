import {ButtonGroup, Callout, FormGroup, HTMLSelect, Intent} from "@blueprintjs/core";
import classNames from "classnames";
import React, {useMemo, useState} from "react";
import {useFormatter} from "../hooks/formatter";
import {useTranslation} from "../hooks/translation";
import {csvSerialize} from "../utils/transform";
import {isActiveItem} from "../utils/validation";
import {ButtonDownload} from "./ButtonDownload";
import {MemoMatrixPreview as MatrixPreview} from "./MatrixPreview";

/** @type {React.FC<TessExpl.ViewProps>} */
const ResultPivot = props => {
  const {params, result} = props;
  const {data} = result;

  const {translate: t} = useTranslation();

  const initial = useMemo(() => {
    const dd = Object.values(params.drilldowns).filter(isActiveItem);
    const ms = Object.values(params.measures).filter(isActiveItem);
    const suggestedCol = dd.find(item => item.dimType === "time") || dd[0];
    const suggestedRow = dd.find(item => item !== suggestedCol);
    return {
      pivotColumns: suggestedCol?.level || "",
      pivotRows: suggestedRow?.level || "",
      pivotValues: ms[0].measure,
      levelNames: dd.map(item => ({
        value: item.level,
        label: item.uniqueName || item.level
      })),
      measureNames: ms.map(item => item.measure)
    };
  }, [result]);
  const {levelNames, measureNames} = initial;

  const [pivotColumns, setPivotColumns] = useState(initial.pivotColumns);
  const [pivotRows, setPivotRows] = useState(initial.pivotRows);
  const [pivotValues, setPivotValues] = useState(initial.pivotValues);

  const {
    getAvailableKeys,
    getFormatter,
    getFormatterKey,
    setFormat
  } = useFormatter(props.cube.measures);

  const measureAggType = useMemo(() => {
    const measure = Object.values(params.measures).find(
      item => item.measure === pivotValues
    );
    return measure ? measure.aggType : "UNKNOWN";
  }, [pivotValues]);

  const availableFormatterKeys = getAvailableKeys(pivotValues)
    .map(key => ({label: getFormatter(key)(12345.678), value: key}));
  const formatterKey = getFormatterKey(pivotValues) || "undefined";
  const formatter = getFormatter(formatterKey);

  const warnings = [];
  if (levelNames.length > 2) {
    warnings.push(
      measureAggType !== "SUM"
        ? <Callout key="notsummeasure" intent={Intent.WARNING}>{t("pivot_view.warning_notsummeasure")}</Callout>
        : <Callout key="sumdimensions">{t("pivot_view.warning_sumdimensions")}</Callout>
    );
  }

  const fileName = [params.cube, pivotColumns, pivotRows, pivotValues].join("_");

  return (
    <div className={classNames("data-matrix", props.className)}>
      <div className="toolbar">
        <h3>{t("pivot_view.title_params")}</h3>
        <FormGroup label={t("pivot_view.label_ddcolumn")} labelFor="matrix-columns">
          <HTMLSelect
            fill={true}
            id="matrix-columns"
            onChange={evt => setPivotColumns(evt.target.value)}
            options={levelNames}
            value={pivotColumns}
          />
        </FormGroup>
        <FormGroup label={t("pivot_view.label_ddrow")} labelFor="matrix-rows">
          <HTMLSelect
            fill={true}
            id="matrix-rows"
            onChange={evt => setPivotRows(evt.target.value)}
            options={levelNames}
            value={pivotRows}
          />
        </FormGroup>
        <FormGroup label={t("pivot_view.label_valmeasure")} labelFor="matrix-values">
          <HTMLSelect
            fill={true}
            id="matrix-values"
            onChange={evt => setPivotValues(evt.target.value)}
            options={measureNames}
            value={pivotValues}
          />
        </FormGroup>

        <FormGroup label={t("pivot_view.label_formatter")} labelFor="matrix-formatters">
          <HTMLSelect
            fill={true}
            id="matrix-formatters"
            onChange={evt => setFormat(pivotValues, evt.target.value)}
            options={[{label: t("placeholders.none"), value: "undefined"}].concat(availableFormatterKeys)}
            value={formatterKey}
          />
        </FormGroup>

        {warnings}

        <h3>{t("pivot_view.title_download")}</h3>
        <ButtonGroup fill>
          <ButtonDownload
            text="CSV"
            fileName={`${fileName}.csv`}
            fileText={() =>
              csvSerialize(data, pivotColumns, pivotRows, pivotValues, formatter, ",")
            }
          />
          <ButtonDownload
            text="TSV"
            fileName={`${fileName}.tsv`}
            fileText={() =>
              csvSerialize(data, pivotColumns, pivotRows, pivotValues, formatter, "\t")
            }
          />
        </ButtonGroup>
      </div>

      <MatrixPreview
        className="preview"
        data={data}
        columnProperty={pivotColumns}
        rowProperty={pivotRows}
        valueProperty={pivotValues}
        formatter={formatter}
        formatterKey={formatterKey}
      />
    </div>
  );
};

export default ResultPivot;
