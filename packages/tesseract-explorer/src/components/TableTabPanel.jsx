import {NonIdealState} from "@blueprintjs/core";
import {Cell, Column, Table} from "@blueprintjs/table";
import cn from "classnames";
import React from "react";

function TableTabPanel(props) {
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

  const columns = Object.keys(data[0]).map(key => {
    const cellRenderer = rowIndex => <Cell>{data[rowIndex][key]}</Cell>;
    return <Column key={key} name={key} cellRenderer={cellRenderer} />;
  });

  return (
    <Table
      className={cn("data-table", props.className)}
      numRows={data.length}
      allowMultipleSelection={false}
      // columnWidths={columnWidths}
      fillBodyWithGhostCells={true}
      isColumnResizable={false}
      isRowResizable={false}
      rowHeights={data.map(() => 22)}
    >
      {columns}
    </Table>
  );
}

export default TableTabPanel;
