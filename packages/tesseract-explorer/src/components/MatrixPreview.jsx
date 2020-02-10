import {NonIdealState} from "@blueprintjs/core";
import {Cell, Column, RowHeaderCell, Table} from "@blueprintjs/table";
import {rollup} from "d3-array";
import React from "react";

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
 * @template T
 * @type {React.FC<OwnProps<T>>}
 */
const MatrixPreview = ({columns, className, data, values, rows}) => {
  if (!columns || !rows || columns === rows || !values || data.length === 0) {
    return <NonIdealState />;
  }

  const columnKeys = Array.from(new Set(data.map(d => d[columns])));
  const rowKeys = Array.from(new Set(data.map(d => d[rows])));

  const rolledData = rollup(
    data,
    i => i.reduce((sum, d) => sum + d[values], 0),
    i => i[columns],
    i => i[rows]
  );

  return (
    <Table
      className={className}
      enableColumnResizing={true}
      enableRowResizing={false}
      getCellClipboardData={(rowIndex, columnIndex) => rolledData.get(columnKeys[columnIndex]).get(rowKeys[rowIndex])}
      key={`${columns}-${rows}-${values}`}
      numRows={rowKeys.length}
      rowHeaderCellRenderer={rowIndex => <RowHeaderCell name={rowKeys[rowIndex]} />}
      rowHeights={rowKeys.map(() => 22)}
    >
      {columnKeys.map((columnKey, columnIndex) =>
        <Column
          cellRenderer={rowIndex =>
            <Cell className="column-number" columnIndex={columnIndex} rowIndex={rowIndex}>
              {rolledData.get(columnKey).get(rowKeys[rowIndex])}
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

export default MatrixPreview;
