import {ButtonGroup, Callout, FormGroup, HTMLSelect, Intent} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import {pivotData} from "../utils/transform";
import ButtonDownload from "./ButtonDownload";
import MatrixPreview from "./MatrixPreview";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {string} cube
 * @property {OlapLevel[]} drilldowns
 * @property {OlapMeasure[]} measures
 * @property {QueryResult} result
 * @property {OlapMeasure | undefined} valueMeasure
 * @property {(level: string) => void} updateColumnsHandler
 * @property {(level: string) => void} updateRowsHandler
 * @property {(measure: string) => void} updateValuesHandler
 */

/** @type {React.FC<OwnProps>} */
const ResultPivot = ({
  className,
  cube,
  drilldowns,
  measures,
  result,
  valueMeasure,
  updateColumnsHandler,
  updateValuesHandler,
  updateRowsHandler
}) => {
  const {data, pivotColumns, pivotRows, pivotValues} = result;

  const levelNames = drilldowns.map(item => ({value: item.name, label: item.uniqueName || item.name}));
  const measureNames = measures.map(item => item.name);

  const filename = [cube, pivotColumns, pivotRows, pivotValues].join("-");

  const warnings =
    drilldowns.length < 2
      ? <Callout intent={Intent.DANGER}>A pivot table needs 2 different drilldowns and a measure to work.</Callout>
      : drilldowns.length > 2
        ? valueMeasure?.aggregatorType !== "SUM"
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
            onChange={evt => updateColumnsHandler(evt.target.value)}
            options={levelNames}
            value={pivotColumns}
          />
        </FormGroup>

        <FormGroup label="Row drilldown" labelFor="matrix-rows">
          <HTMLSelect
            fill={true}
            id="matrix-rows"
            onChange={evt => updateRowsHandler(evt.target.value)}
            options={levelNames}
            value={pivotRows}
          />
        </FormGroup>

        <FormGroup label="Value measure" labelFor="matrix-values">
          <HTMLSelect
            fill={true}
            id="matrix-values"
            onChange={evt => updateValuesHandler(evt.target.value)}
            options={measureNames}
            value={pivotValues}
          />
        </FormGroup>

        <h3>Download</h3>
        <ButtonGroup fill>
          <ButtonDownload
            text="CSV"
            fileName={`${filename}.csv`}
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
            fileName={`${filename}.tsv`}
            fileText={pivotData.bind(
              null,
              data,
              pivotColumns,
              pivotRows,
              pivotValues,
              "\t"
            )}
          />
          {/* <ButtonDownload text="JSON" fileName={`${filename}.json`} fileText={} /> */}
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
