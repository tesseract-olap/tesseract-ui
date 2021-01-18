import {NonIdealState} from "@blueprintjs/core";
import {Cell, Column, RowHeaderCell, Table} from "@blueprintjs/table";
import React, {memo} from "react";
import {regroup, sortingTableBy, sumBy} from "../utils/transform";

/**
 * @template T
 * @typedef OwnProps
 * @property {string} [className]
 * @property {keyof T | undefined} columns
 * @property {T[]} data
 * @property {keyof T | undefined} rows
 * @property {keyof T | undefined} values
 */

/**
 * @template {Record<string, number>} T
 * @type {React.FC<OwnProps<T>>}
 */
export const MatrixPreview = ({columns, className, data, values, rows}) => {
  if (!columns || !rows || columns === rows || !values || data.length === 0) {
    return <NonIdealState />;
  }

  const columnKeys = sortingTableBy(data, columns);
  const rowKeys = sortingTableBy(data, rows);

  /** @type {Map<string, Map<string, number>>} */
  const rolledData = regroup(
    data,
    group => sumBy(group, values),
    i => `${i[columns]}`,
    i => `${i[rows]}`
  );

  return (
    <Table
      className={className}
      enableColumnResizing={true}
      enableRowResizing={false}
      getCellClipboardData={(rowIndex, columnIndex) =>
        rolledData.get(`${columnKeys[columnIndex]}`).get(`${rowKeys[rowIndex]}`)
      }
      key={`${columns}-${rows}-${values}`}
      numRows={rowKeys.length}
      rowHeaderCellRenderer={rowIndex => <RowHeaderCell name={rowKeys[rowIndex]} />}
      rowHeights={Array(rowKeys.length).fill(22)}
    >
      {columnKeys.map((columnKey, columnIndex) =>
        <Column
          cellRenderer={rowIndex =>
            <Cell
              className="column-number"
              columnIndex={columnIndex}
              rowIndex={rowIndex}
            >
              {rolledData.get(`${columnKey}`).get(`${rowKeys[rowIndex]}`)}
            </Cell>
          }
          key={`${columnKey}-${values}`}
          id={`col${columnKey}`}
          name={columnKey}
        />
      )}
    </Table>
  );
};

export const MemoMatrixPreview = memo(MatrixPreview);
