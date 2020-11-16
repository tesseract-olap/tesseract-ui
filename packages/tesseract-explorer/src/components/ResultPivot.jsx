import {ButtonGroup, Callout, FormGroup, HTMLSelect, Intent} from "@blueprintjs/core";
import classNames from "classnames";
import React, {useState, useMemo} from "react";
import {pivotData} from "../utils/transform";
import {isActiveItem} from "../utils/validation";
import ButtonDownload from "./ButtonDownload";
import MatrixPreview from "./MatrixPreview";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {import("../../types/explorer").QueryParams} params
 * @property {import("../../types/explorer").QueryResult} result
 */

/** @type {React.FC<OwnProps>} */
const ResultPivot = ({
  className,
  params,
  result
}) => {
  const {data} = result;

  const initial = useMemo(() => {
    const dd = Object.values(params.drilldowns).filter(isActiveItem);
    const ms = Object.values(params.measures).filter(isActiveItem);
    const suggestedCol = dd.find(item => item.dimType === "time") || dd[0];
    const suggestedRow = dd.find(item => item !== suggestedCol);
    return {
      pivotColumns: suggestedCol?.level || "",
      pivotRows: suggestedRow?.level || "",
      pivotValues: ms[0].measure,
      levelNames: dd.map(item => ({value: item.level, label: item.uniqueName || item.level})),
      measureNames: ms.map(item => item.measure)
    };
  }, [result]);
  const {levelNames, measureNames} = initial;

  const [pivotColumns, setPivotColumns] = useState(initial.pivotColumns);
  const [pivotRows, setPivotRows] = useState(initial.pivotRows);
  const [pivotValues, setPivotValues] = useState(initial.pivotValues);

  const fileName = [params.cube, pivotColumns, pivotRows, pivotValues].join("-");

  const measureAggType = useMemo(() => {
    const measure = Object.values(params.measures).find(item => item.measure === pivotValues);
    return measure ? measure.aggType : "UNKNOWN";
  }, [pivotValues]);

  const warnings =
    levelNames.length < 2
      ? <Callout intent={Intent.DANGER}>A pivot table needs 2 different drilldowns and a measure to work.</Callout>
      : levelNames.length > 2
        ? measureAggType !== "SUM"
          ? <Callout intent={Intent.WARNING}>The current query contains more than 2 drilldowns, and the aggregation type of the measure is not &quot;SUM&quot;. The values you&apos;re getting might not be meaningful.</Callout>
          : <Callout>There&apos;s more than 2 drilldowns in this query. Remaining values will be summed.</Callout>
        : undefined;

  return (
    <div className={classNames("data-matrix", className)}>
      <div className="toolbar">
        {warnings}

        <h3>Parameters</h3>

        <FormGroup label="Column drilldown" labelFor="matrix-columns">
          <HTMLSelect
            fill={true}
            id="matrix-columns"
            onChange={evt => setPivotColumns(evt.target.value)}
            options={levelNames}
            value={pivotColumns}
          />
        </FormGroup>

        <FormGroup label="Row drilldown" labelFor="matrix-rows">
          <HTMLSelect
            fill={true}
            id="matrix-rows"
            onChange={evt => setPivotRows(evt.target.value)}
            options={levelNames}
            value={pivotRows}
          />
        </FormGroup>

        <FormGroup label="Value measure" labelFor="matrix-values">
          <HTMLSelect
            fill={true}
            id="matrix-values"
            onChange={evt => setPivotValues(evt.target.value)}
            options={measureNames}
            value={pivotValues}
          />
        </FormGroup>

        <h3>Download</h3>
        <ButtonGroup fill>
          <ButtonDownload
            text="CSV"
            fileName={`${fileName}.csv`}
            fileText={pivotData.bind(
              null,
              data,
              pivotColumns,
              pivotRows,
              pivotValues,
              ","
            )}
          />
          <ButtonDownload
            text="TSV"
            fileName={`${fileName}.tsv`}
            fileText={pivotData.bind(
              null,
              data,
              pivotColumns,
              pivotRows,
              pivotValues,
              "\t"
            )}
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
