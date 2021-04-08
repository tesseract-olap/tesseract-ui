import {NonIdealState} from "@blueprintjs/core";
import {Cell, Column, RowHeaderCell, Table} from "@blueprintjs/table";
import {format} from "d3plus-format";
import React, {memo} from "react";
import {defaultFormatters} from "../utils/format";
import {regroup, sortingTableBy, sumBy} from "../utils/transform";

/**
 * @template T
 * @typedef OwnProps
 * @property {string} [className]
 * @property {keyof T | undefined} columns
 * @property {T[]} data
 * @property {string | undefined} formatterKey
 * @property {keyof T | undefined} rows
 * @property {keyof T | undefined} values
 */

/** @type {React.FC<OwnProps<Record<string, number>>>} */
export const MatrixPreview = props => {
  const {columns, data, formatterKey, values, rows} = props;

  if (!columns || !rows || columns === rows || !values || data.length === 0) {
    return <NonIdealState />;
  }

  const columnKeys = sortingTableBy(data, columns);
  const rowKeys = sortingTableBy(data, rows);

  const formatter = formatterKey
    ? defaultFormatters[formatterKey] || format(formatterKey)
    : undefined;

  const rolledData = regroup(
    data,
    group => sumBy(group, values),
    i => `${i[columns]}`,
    i => `${i[rows]}`
  );

  return (
    <Table
      className={props.className}
      enableColumnResizing={true}
      enableRowResizing={false}
      getCellClipboardData={(rowIndex, columnIndex) => {
        const columnData = rolledData.get(`${columnKeys[columnIndex]}`) || new Map();
        const value = columnData.get(`${rowKeys[rowIndex]}`);
        return formatter && value != null ? formatter(value) : value;
      }}
      key={`${columns}-${rows}-${values}-${formatterKey}`}
      numRows={rowKeys.length}
      rowHeaderCellRenderer={rowIndex => <RowHeaderCell name={rowKeys[rowIndex]} />}
      rowHeights={Array(rowKeys.length).fill(22)}
    >
      {columnKeys.map((columnKey, columnIndex) => {
        const columnData = rolledData.get(`${columnKey}`) || new Map();
        return (
          <Column
            cellRenderer={rowIndex => {
              const value = columnData.get(`${rowKeys[rowIndex]}`);
              return (
                <Cell
                  className="column-number"
                  columnIndex={columnIndex}
                  rowIndex={rowIndex}
                >
                  {formatter && value != null ? formatter(value) : value}
                </Cell>
              );
            }}
            key={`${columnKey}-${values}`}
            id={`col${columnKey}`}
            name={columnKey}
          />
        );
      })}
    </Table>
  );
};

export const MemoMatrixPreview = memo(MatrixPreview);
