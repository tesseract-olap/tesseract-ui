import {
  ButtonGroup,
  Callout,
  FormGroup,
  HTMLSelect,
  Intent
} from "@blueprintjs/core";
import classNames from "classnames";
import React, {useState, useMemo} from "react";
import {csvSerialize} from "../utils/transform";
import {useTranslation} from "../utils/useTranslation";
import {isActiveItem} from "../utils/validation";
import ButtonDownload from "./ButtonDownload";
import {MemoMatrixPreview as MatrixPreview} from "./MatrixPreview";

/** @type {React.FC<TessExpl.ViewProps>} */
const ResultPivot = ({className, params, result}) => {
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

  const fileName = [params.cube, pivotColumns, pivotRows, pivotValues].join("-");

  const measureAggType = useMemo(() => {
    const measure = Object.values(params.measures).find(
      item => item.measure === pivotValues
    );
    return measure ? measure.aggType : "UNKNOWN";
  }, [pivotValues]);

  const warnings =
    levelNames.length < 2
      ? <Callout intent={Intent.DANGER}>{t("pivot_view.callout_onedimension")}</Callout>
      : levelNames.length > 2
        ? measureAggType !== "SUM"
          ? <Callout intent={Intent.WARNING}>{t("pivot_view.callout_notsummeasure")}</Callout>
          : <Callout>{t("pivot_view.callout_sumdimensions")}</Callout>
        : undefined;

  return (
    <div className={classNames("data-matrix", className)}>
      <div className="toolbar">
        {warnings}

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

        <h3>{t("pivot_view.title_download")}</h3>
        <ButtonGroup fill>
          <ButtonDownload
            text="CSV"
            fileName={`${fileName}.csv`}
            fileText={() =>
              csvSerialize(data, pivotColumns, pivotRows, pivotValues, ",")
            }
          />
          <ButtonDownload
            text="TSV"
            fileName={`${fileName}.tsv`}
            fileText={() =>
              csvSerialize(data, pivotColumns, pivotRows, pivotValues, "\t")
            }
          />
        </ButtonGroup>
      </div>

      <MatrixPreview
        columns={pivotColumns}
        className="preview"
        data={data}
        values={pivotValues}
        rows={pivotRows}
      />
    </div>
  );
};

export default ResultPivot;
