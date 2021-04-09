import {NonIdealState} from "@blueprintjs/core";
import {Cell, Column, RowHeaderCell, Table} from "@blueprintjs/table";
import React, {memo} from "react";
import {useTranslation} from "../hooks/translation";
import {regroup, sortingTableBy, sumBy} from "../utils/transform";

/**
 * @template T
 * @typedef OwnProps
 * @property {string} [className]
 * @property {T[]} data
 * @property {keyof T | undefined} columnProperty
 * @property {keyof T | undefined} rowProperty
 * @property {keyof T | undefined} valueProperty
 * @property {string | undefined} formatterKey
 * @property {TessExpl.Formatter | undefined} formatter
 */

/** @type {React.FC<OwnProps<Record<string, number>>>} */
export const MatrixPreview = props => {
  const {columnProperty, data, valueProperty, rowProperty} = props;
  const formatter = props.formatter || (n => n);

  const {translate: t} = useTranslation();

  if (!columnProperty || !rowProperty || !valueProperty) {
    return <NonIdealState
      icon="warning-sign"
      title={t("pivot_view.error_missingparams")}
    />;
  }
  if (columnProperty === rowProperty) {
    return <NonIdealState
      icon="warning-sign"
      title={t("pivot_view.error_onedimension")}
    />;
  }

  const colMembers = sortingTableBy(data, columnProperty);
  const rowMembers = sortingTableBy(data, rowProperty);

  /** @type {Map<string, Map<string, number>>} */
  const nestedData = regroup(
    data,
    group => sumBy(group, valueProperty),
    columnProperty,
    rowProperty
  );

  return (
    <Table
      className={props.className}
      enableColumnResizing={true}
      enableRowResizing={false}
      getCellClipboardData={(rowIndex, colIndex) => {
        const columnData = nestedData.get(colMembers[colIndex]);
        const value = columnData && columnData.get(rowMembers[rowIndex]);
        return value != null ? formatter(value) : "";
      }}
      key={`${columnProperty}-${rowProperty}-${valueProperty}-${props.formatterKey}`}
      numRows={rowMembers.length}
      rowHeaderCellRenderer={rowIndex => <RowHeaderCell name={rowMembers[rowIndex]} />}
      rowHeights={Array(rowMembers.length).fill(22)}
    >
      {colMembers.map(colHeader => {
        const columnData = nestedData.get(colHeader);
        return (
          <Column
            cellRenderer={(rowIndex, colIndex) => {
              const value = columnData && columnData.get(rowMembers[rowIndex]);
              return (
                <Cell className="column-number" columnIndex={colIndex} rowIndex={rowIndex}>
                  {value != null ? formatter(value) : ""}
                </Cell>
              );
            }}
            key={`${colHeader}-${valueProperty}`}
            id={`col${colHeader}`}
            name={colHeader}
          />
        );
      })}
    </Table>
  );
};

export const MemoMatrixPreview = memo(MatrixPreview);
