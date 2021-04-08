import {
  ButtonGroup,
  Callout,
  FormGroup,
  HTMLSelect,
  Intent
} from "@blueprintjs/core";
import classNames from "classnames";
import {format} from "d3plus-format";
import React, {useMemo, useState} from "react";
import {filterMap} from "../utils/array";
import {defaultFormatters, useFormatter} from "../utils/format";
import {useTranslation} from "../utils/localization";
import {csvSerialize} from "../utils/transform";
import {isActiveItem} from "../utils/validation";
import ButtonDownload from "./ButtonDownload";
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

  const [formatTemplates, userFormats, setUserFormats] = useFormatter(props.cube.measures);

  const fileName = [params.cube, pivotColumns, pivotRows, pivotValues].join("-");

  const measureAggType = useMemo(() => {
    const measure = Object.values(params.measures).find(
      item => item.measure === pivotValues
    );
    return measure ? measure.aggType : "UNKNOWN";
  }, [pivotValues]);

  const availableFormatters = filterMap(
    Object.keys(defaultFormatters).concat(formatTemplates[pivotValues] || ""),
    (key, index, list) => {
      if (!key || key === "identity" || list.indexOf(key) !== index) {
        return null;
      }
      const formatter = defaultFormatters[key] || format(key);
      return {label: formatter(12345.678), value: key};
    }
  );
  const formatterKey = userFormats[pivotValues] ||
                       formatTemplates[pivotValues] ||
                       "Decimal";

  const warnings = [];
  if (levelNames.length < 2) {
    warnings.push(
      <Callout key="callout_onedimension" intent={Intent.DANGER}>{t("pivot_view.callout_onedimension")}</Callout>
    );
  }
  else if (levelNames.length > 2) {
    warnings.push(
      measureAggType !== "SUM"
        ? <Callout key="callout_notsummeasure" intent={Intent.WARNING}>{t("pivot_view.callout_notsummeasure")}</Callout>
        : <Callout key="callout_sumdimensions">{t("pivot_view.callout_sumdimensions")}</Callout>
    );
  }

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
            onChange={evt => setUserFormats({
              ...userFormats,
              [pivotValues]: evt.target.value
            })}
            options={availableFormatters}
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
        className="preview"
        columns={pivotColumns}
        data={data}
        formatterKey={formatterKey}
        rows={pivotRows}
        values={pivotValues}
      />
    </div>
  );
};

export default ResultPivot;
