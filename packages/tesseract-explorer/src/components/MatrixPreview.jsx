import {NonIdealState} from "@blueprintjs/core";
import {Cell, Column, RowHeaderCell, Table} from "@blueprintjs/table";
import {group, rollup} from "d3-array";
import React, {memo} from "react";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {string | undefined} columns
 * @property {any[]} data
 * @property {string | undefined} rows
 * @property {string | undefined} values
 */

/** @type {React.FC<OwnProps>} */
const MatrixPreview = function({columns, className, data, values, rows}) {
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
      getCellClipboardData={(rowIndex, columnIndex) =>
        data[rowIndex][columnKeys[columnIndex]]}
      rowHeaderCellRenderer={rowIndex => <RowHeaderCell name={rowKeys[rowIndex]} />}
      numRows={rowKeys.length}
      rowHeights={rowKeys.map(() => 22)}
    >
      {columnKeys.map((columnKey, columnIndex) => (
        <Column
          cellRenderer={rowIndex => (
            <Cell className="column-number" columnIndex={columnIndex} rowIndex={rowIndex}>
              {rolledData.get(columnKey).get(rowKeys[rowIndex])}
            </Cell>
          )}
          key={columnKey + values}
          id={columnKey}
          name={columnKey}
        />
      ))}
    </Table>
  );
};

export default MatrixPreview;
