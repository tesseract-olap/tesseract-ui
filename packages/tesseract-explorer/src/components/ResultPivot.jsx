import {ButtonGroup, Callout, FormGroup, Intent, NonIdealState, Spinner} from "@blueprintjs/core";
import {Cell, Column, Table} from "@blueprintjs/table";
import clsx from "classnames";
import React, {Fragment, memo, useMemo, useState} from "react";
import {useFormatParams, usePivottedData} from "../hooks/pivot";
import {useTranslation} from "../hooks/translation";
import {filterMap} from "../utils/array";
import {stringifyMatrix} from "../utils/pivot";
import {isActiveItem} from "../utils/validation";
import {ButtonDownload} from "./ButtonDownload";
import {SelectObject} from "./Select";

/** @type {React.FC<TessExpl.ViewProps>} */
const ResultPivot = props => {
  const {params, result} = props;

  const {translate: t} = useTranslation();

  const initial = useMemo(() => {
    const ddnOptions = Object.values(params.drilldowns)
      .filter(isActiveItem)
      .flatMap(item => [
        // The actual level
        {label: item.uniqueName || item.level, value: item.level, type: item.dimType},
        // plus the active properties
        ...filterMap(item.properties, prop =>
          isActiveItem(prop)
            ? {label: `${prop.name} (${prop.level})`, value: prop.name, type: "prop"}
            : null
        )
      ]);

    const msrOptions = filterMap(Object.values(params.measures), item =>
      isActiveItem(item)
        ? {value: item.measure, type: item.aggType}
        : null
    );

    const colProperty = ddnOptions.find(item => item.type === "time") || ddnOptions[0];
    const rowProperty = ddnOptions.find(item => item !== colProperty) || ddnOptions[0];

    return {ddnOptions, msrOptions, colProperty, rowProperty, valProperty: msrOptions[0]};
  }, [result]);

  const [colProp, setColumnProp] = useState(initial.colProperty);
  const [rowProp, setRowProp] = useState(initial.rowProperty);
  const [valProp, setValueProp] = useState(initial.valProperty);

  const {ddnOptions, msrOptions} = initial;
  const fileName = [params.cube, colProp.label, rowProp.label, valProp.value].join("_");

  const pivottedData = usePivottedData(result.data, colProp.value, rowProp.value, valProp.value);

  const {
    formatExample,
    formatter,
    formatterKey,
    formatterKeyOptions,
    setFormat
  } = useFormatParams(props.cube.measures, valProp.value);

  const warnings = useMemo(() => {
    const measure = msrOptions.find(item => item === valProp);
    const warnings = [];
    if (ddnOptions.length > 2 && measure) {
      warnings.push(
        measure.type !== "SUM"
          ? <Callout key="notsummeasure" intent={Intent.WARNING}>{t("pivot_view.warning_notsummeasure")}</Callout>
          : <Callout key="sumdimensions">{t("pivot_view.warning_sumdimensions")}</Callout>
      );
    }
    return warnings;
  }, [ddnOptions, msrOptions, valProp]);

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
  }, [pivottedData, formatter]);

  if (ddnOptions.length < 2) {
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

        <FormGroup label={t("pivot_view.label_ddcolumn")}>
          <SelectObject
            fill={true}
            getLabel={item => item.label}
            items={ddnOptions}
            onItemSelect={setColumnProp}
            selectedItem={colProp.label}
          />
        </FormGroup>

        <FormGroup label={t("pivot_view.label_ddrow")}>
          <SelectObject
            fill={true}
            getLabel={item => item.label}
            items={ddnOptions}
            onItemSelect={setRowProp}
            selectedItem={rowProp.label}
          />
        </FormGroup>

        <FormGroup label={t("pivot_view.label_valmeasure")}>
          <SelectObject
            fill={true}
            getLabel={item => item.value}
            items={msrOptions}
            onItemSelect={setValueProp}
            selectedItem={valProp.value}
          />
        </FormGroup>

        <FormGroup label={t("pivot_view.label_formatter")}>
          <SelectObject
            fill={true}
            getLabel={item => item.label}
            items={formatterKeyOptions}
            onItemSelect={item => setFormat(valProp.value, item.value)}
            selectedItem={formatExample}
          />
        </FormGroup>

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


export default ResultPivot;
