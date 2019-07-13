import {NonIdealState} from "@blueprintjs/core";
import {Cell, Column, Table} from "@blueprintjs/table";
import cn from "classnames";
import React from "react";

/**
 * @typedef OwnProps
 * @property {(row: number, col: number) => any} cellClipboardData
 * @property {string} className
 * @property {any[]} data
 */

/** @type {React.FC<OwnProps>} */
const TableTabPanel = function(props) {
  const {data} = props;

  if (data.length === 0) {
    return (
      <NonIdealState
        icon="issue"
        title="Empty dataset"
        description="The query didn't return elements. Try again with different parameters."
      />
    );
  }

  const columnKeys = Object.keys(data[0]);
  const columns = columnKeys.map((key, columnIndex) => {
    const cellRenderer = rowIndex => (
      <Cell columnIndex={columnIndex} rowIndex={rowIndex}>
        {data[rowIndex][key]}
      </Cell>
    );
    return <Column key={key} id={key} name={key} cellRenderer={cellRenderer} />;
  });

  const cellClipboardData = props.cellClipboardData.bind(null, data, columnKeys);

  return (
    <Table
      className={cn("data-table", props.className)}
      enableColumnResizing={false}
      // enableGhostCells={true}
      // enableMultipleSelection={false}
      enableRowResizing={false}
      getCellClipboardData={cellClipboardData}
      numRows={data.length}
      rowHeights={data.map(() => 22)}
    >
      {columns}
    </Table>
  );
};

TableTabPanel.defaultProps = {
  cellClipboardData: (data, keys, rowIndex, columnIndex) =>
    data[rowIndex][keys[columnIndex]]
};

export default TableTabPanel;
