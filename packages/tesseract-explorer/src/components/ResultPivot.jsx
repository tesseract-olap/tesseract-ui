import {ButtonGroup, Callout, FormGroup, HTMLSelect, Intent, NonIdealState, Spinner} from "@blueprintjs/core";
import {Cell, Column, Table} from "@blueprintjs/table";
import clsx from "classnames";
import React, {Fragment, memo, useMemo, useState} from "react";
import {useFormatParams, usePivottedData} from "../hooks/pivot";
import {useTranslation} from "../hooks/translation";
import {stringifyMatrix} from "../utils/pivot";
import {isActiveItem} from "../utils/validation";
import {ButtonDownload} from "./ButtonDownload";

/** @type {React.FC<TessExpl.ViewProps>} */
const ResultPivot = props => {
  const {params, result} = props;

  const {translate: t} = useTranslation();

  const initial = useMemo(() => {
    const dd = Object.values(params.drilldowns).filter(isActiveItem);
    const ms = Object.values(params.measures).filter(isActiveItem);
    const initialCol = dd.find(item => item.dimType === "time") || dd[0];
    const initialRow = dd.find(item => item !== initialCol);
    return {
      colProperty: initialCol ? initialCol.uniqueName || initialCol.level : "",
      levelNames: dd.map(item => item.uniqueName || item.level),
      measureNames: ms.map(item => item.measure),
      rowProperty: initialRow ? initialRow.uniqueName || initialRow.level : "",
      valProperty: ms[0].measure
    };
  }, [result]);

  const {levelNames, measureNames} = initial;

  const [colProp, setColumnProp] = useState(initial.colProperty);
  const [rowProp, setRowProp] = useState(initial.rowProperty);
  const [valProp, setValueProp] = useState(initial.valProperty);

  const fileName = [params.cube, colProp, rowProp, valProp].join("_");

  const pivottedData = usePivottedData(result.data, colProp, rowProp, valProp);

  const {
    formatter,
    formatterKey,
    formatterKeyOptions,
    setFormat
  } = useFormatParams(props.cube.measures, valProp);

  const warnings = useMemo(() => {
    const measure = Object.values(params.measures)
      .find(item => item.measure === valProp);
    const warnings = [];
    if (levelNames.length > 2 && measure) {
      warnings.push(
        measure.aggType !== "SUM"
          ? <Callout key="notsummeasure" intent={Intent.WARNING}>{t("pivot_view.warning_notsummeasure")}</Callout>
          : <Callout key="sumdimensions">{t("pivot_view.warning_sumdimensions")}</Callout>
      );
    }
    return warnings;
  }, [valProp, levelNames]);

  const downloadToolbar = useMemo(() => {
    if (!pivottedData) return null;

    return (
      <Fragment>
        <h3>{t("pivot_view.title_download")}</h3>
        <ButtonGroup fill>
          <ButtonDownload
            text="CSV"
            provider={() => ({
              name: fileName,
              extension: "csv",
              content: stringifyMatrix(pivottedData, formatter, "csv")
            })}
          />
          <ButtonDownload
            text="TSV"
            provider={() => ({
              name: fileName,
              extension: "tsv",
              content: stringifyMatrix(pivottedData, formatter, "tsv")
            })}
          />
        </ButtonGroup>
      </Fragment>
    );
  }, [pivottedData]);

  if (levelNames.length < 2) {
    return <NonIdealState
      icon="warning-sign"
      title={t("pivot_view.error_missingparams")}
    />;
  }

  let preview;
  if (!colProp || !rowProp || !valProp) {
    preview = <NonIdealState
      icon="warning-sign"
      title={t("pivot_view.error_missingparams")}
    />;
  }
  else if (colProp === rowProp) {
    preview = <NonIdealState
      icon="warning-sign"
      title={t("pivot_view.error_onedimension")}
    />;
  }
  else if (!pivottedData) {
    preview = <NonIdealState
      icon={<Spinner size={100} />}
      title={t("pivot_view.loading_title")}
      description={t("pivot_view.loading_details")}
    />;
  }
  else {
    preview = <MemoMatrixTable
      key={`${fileName} ${formatterKey}`}
      data={pivottedData.data}
      headers={pivottedData.headers}
      formatter={formatter}
    />;
  }

  return (
    <div className={clsx("data-matrix flex flex-row flex-nowrap", props.className)}>
      <div className="toolbar flex-grow-0 flex-shrink-0 w-24 p-3">
        <h3 className="mt-0">{t("pivot_view.title_params")}</h3>
        <SidebarSelector
          id="matrix-columns"
          label={t("pivot_view.label_ddcolumn")}
          onChange={setColumnProp}
          options={levelNames}
          value={colProp}
        />
        <SidebarSelector
          id="matrix-rows"
          label={t("pivot_view.label_ddrow")}
          onChange={setRowProp}
          options={levelNames}
          value={rowProp}
        />
        <SidebarSelector
          id="matrix-values"
          label={t("pivot_view.label_valmeasure")}
          onChange={setValueProp}
          options={measureNames}
          value={valProp}
        />
        <SidebarSelector
          id="matrix-formatters"
          label={t("pivot_view.label_formatter")}
          onChange={value => setFormat(valProp, value)}
          options={formatterKeyOptions}
          value={formatterKey}
        />

        {warnings}

        {downloadToolbar}
      </div>

      {preview}
    </div>
  );
};

/** @type {React.FC<JSONArrays & {formatter: TessExpl.Formatter}>} */
const MatrixTable = props => {
  const {data: values, formatter} = props;

  const getDisplayValue = (rowIndex, colIndex) => {
    const value = values[rowIndex][colIndex];
    return typeof value === "number"
      ? ["column-number", formatter(value)]
      : ["column-string", value || ""];
  };

  const cellRenderer = (rowIndex, colIndex) => {
    const value = getDisplayValue(rowIndex, colIndex);
    return (
      <Cell className={value[0]} columnIndex={colIndex} rowIndex={rowIndex}>
        {value[1]}
      </Cell>
    );
  };

  return (
    <Table
      className="preview flex-grow flex-shrink min-w-0"
      enableColumnResizing={true}
      enableRowResizing={false}
      getCellClipboardData={(row, col) => getDisplayValue(row, col)[1]}
      numRows={values.length}
      rowHeights={Array(values.length).fill(22)}
    >
      {props.headers.slice(0, 40).map(header =>
        <Column cellRenderer={cellRenderer} id={header} key={header} name={header} />
      )}
    </Table>
  );
};

const MemoMatrixTable = memo(MatrixTable);

/**
 * @typedef SidebarSelectorProps
 * @property {string} id
 * @property {string} label
 * @property {(value: string) => void} onChange
 * @property {BlueprintCore.HTMLSelectProps["options"]} options
 * @property {BlueprintCore.HTMLSelectProps["value"]} value
 */

/** @type {React.FC<SidebarSelectorProps>} */
const SidebarSelector = props =>
  <FormGroup label={props.label} labelFor={props.id}>
    <HTMLSelect
      fill={true}
      id={props.id}
      onChange={evt => props.onChange(evt.target.value)}
      options={props.options}
      value={props.value}
    />
  </FormGroup>;

export default ResultPivot;
