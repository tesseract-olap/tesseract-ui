import {ButtonGroup, Callout, FormGroup, Intent, NonIdealState, Spinner} from "@blueprintjs/core";
import {Cell, Column, Table} from "@blueprintjs/table";
import clsx from "classnames";
import React, {Fragment, memo, useMemo, useState} from "react";
import {useFormatParams, usePivottedData} from "../hooks/pivot";
import {useTranslation} from "../hooks/translation";
import {filterMap} from "../utils/array";
import {getCaption} from "../utils/string";
import {isActiveItem} from "../utils/validation";
import {ButtonDownload} from "./ButtonDownload";
import {SelectObject} from "./Select";

/** @type {React.FC<TessExpl.ViewProps>} */
export const PivotView = props => {
  const {cube, params, result} = props;
  const locale = params.locale;

  const {translate: t} = useTranslation();

  const measureOptions = useMemo(() => {
    const measureMap = Object.fromEntries(
      cube.measures.map(msr => [msr.name, msr])
    );
    return params.measures.map(value => {
      const entity = measureMap[value];
      return {value, label: getCaption(entity, locale), type: entity.aggregatorType};
    });
  }, [cube, params.measures, locale]);

  const drilldownOptions = useMemo(() => {
    const dimensionMap = Object.fromEntries(
      cube.dimensions.map(dim => [dim.name, dim])
    );
    const levelMap = Object.fromEntries(
      cube.dimensions.map(dim => [dim.name, Object.fromEntries(
        dim.hierarchies.map(hie => [hie.name, Object.fromEntries(
          hie.levels.map(lvl => [lvl.name, lvl])
        )])
      )])
    );

    return Object.values(params.drilldowns).filter(isActiveItem).flatMap(item => {
      const entity = levelMap[item.dimension][item.hierarchy][item.level];
      const caption = getCaption(entity, locale);

      const type = dimensionMap[item.dimension].dimensionType.toString();
      const propertyMap = Object.fromEntries(
        entity.properties.map(prop => [prop.name, prop])
      );

      const levelOptions = [{value: item.level, label: caption, type}];
      if (`${item.level} ID` in result.data[0]) {
        levelOptions.push({value: `${item.level} ID`, label: `${caption} ID`, type});
      }
      return levelOptions.concat(
        filterMap(item.properties, item => {
          const entity = propertyMap[item.name];
          return !item.active ? null : {
            value: item.name,
            label: `${getCaption(entity, locale)} (${caption})`,
            type: "prop"
          };
        })
      );
    });
  }, [cube, params.drilldowns, locale]);

  const [colProp, setColumnProp] = useState(() =>
    drilldownOptions.find(item => item.type === "time") || drilldownOptions[0]
  );
  const [rowProp, setRowProp] = useState(() =>
    drilldownOptions.find(item => item !== colProp) || drilldownOptions[0]
  );
  const [valProp, setValueProp] = useState(() => measureOptions[0]);

  const fileName = [params.cube, colProp.label, rowProp.label, valProp.value].join("_");

  const [pivottedData, pivottingError] = usePivottedData(result.data, colProp.value, rowProp.value, valProp.value);

  const {
    formatExample,
    formatter,
    formatterKey,
    formatterKeyOptions,
    setFormat
  } = useFormatParams(props.cube.measures, valProp.value);

  const warnings = useMemo(() => {
    const warnings = [];
    if (rowProp.type === "prop" || colProp.type === "prop") {
      warnings.push(
        <Callout key="propertypivot" intent={Intent.WARNING}>{t("pivot_view.warning_propertypivot")}</Callout>
      );
    }
    const drilldownCount = Object.values(params.drilldowns).filter(isActiveItem).length;
    if (drilldownCount > 2) {
      warnings.push(
        valProp.type !== "SUM"
          ? <Callout key="notsummeasure" intent={Intent.WARNING}>{t("pivot_view.warning_notsummeasure")}</Callout>
          : <Callout key="sumdimensions">{t("pivot_view.warning_sumdimensions")}</Callout>
      );
    }
    return warnings;
  }, [params.drilldowns, rowProp, colProp, valProp]);

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

  if (drilldownOptions.length < 2) {
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
  else if (pivottingError != null) {
    preview = <NonIdealState
      icon="error"
      title={t("pivot_view.error_internal")}
      description={t("pivot_view.error_internal_detail", {error: pivottingError.message})}
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

        <FormGroup
          label={colProp.type === "prop"
            ? t("pivot_view.label_ddcolumnprop")
            : t("pivot_view.label_ddcolumn")
          }
        >
          <SelectObject
            fill={true}
            getLabel={item => item.label}
            items={drilldownOptions}
            onItemSelect={setColumnProp}
            selectedItem={colProp.label}
          />
        </FormGroup>

        <FormGroup
          label={rowProp.type === "prop"
            ? t("pivot_view.label_ddrowprop")
            : t("pivot_view.label_ddrow")
          }
        >
          <SelectObject
            fill={true}
            getLabel={item => item.label}
            items={drilldownOptions}
            onItemSelect={setRowProp}
            selectedItem={rowProp.label}
          />
        </FormGroup>

        <FormGroup label={t("pivot_view.label_valmeasure")}>
          <SelectObject
            fill={true}
            getLabel={item => item.label}
            items={measureOptions}
            onItemSelect={setValueProp}
            selectedItem={valProp.label}
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

  /** @type {(rowIndex: number, colIndex: number) => [string, string | number]} */
  const getDisplayValue = (rowIndex, colIndex) => {
    const value = values[rowIndex][colIndex];
    return colIndex > 0 && typeof value === "number"
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
 * Outputs a CSV-like string.
 * @param {JSONArrays} matrix
 * @param {TessExpl.Formatter} formatter
 * @param {"csv" | "tsv"} format
 * @returns {string}
 */
function stringifyMatrix(matrix, formatter, format) {
  const joint = {csv: ",", tsv: "\t"}[format];
  const safeQuoter = value => {
    const str = `${value}`.trim();
    return str.includes(joint) ? JSON.stringify(str) : str;
  };
  const safeFormatter = value =>
    value === undefined ? "" : safeQuoter(formatter(value));

  return [
    matrix.headers.map(safeQuoter).join(joint),
    ...matrix.data.map(row =>
      [safeQuoter(row[0]), ...row.slice(1).map(safeFormatter)].join(joint)
    )
  ].join("\n");
}
