import {Menu, MenuItem} from "@blueprintjs/core";
import {Cell, Column, ColumnHeaderCell, Table} from "@blueprintjs/table";
import classNames from "classnames";
import React, {useMemo, useState} from "react";
import {sortByKey} from "../utils/array";
import {useTranslation} from "../utils/localization";

/** @type {React.FC<TessExpl.ViewProps>} */
const ResultTable = props => {
  const {data = []} = props.result;

  const {translate: t} = useTranslation();

  const [sortKey, setSortKey] = useState("");
  const [sortDescending, setSortDescending] = useState(true);

  const sortedData = useMemo(
    () => sortByKey(data.slice(), sortKey, sortDescending),
    [data, sortKey, sortDescending]
  );

  const columnKeys = Object.keys(sortedData[0]);
  const columnTypes = columnKeys.map(key => typeof sortedData[0][key]);
  const columns = columnKeys.map((columnKey, columnIndex) => {
    const cellRenderer = rowIndex =>
      <Cell
        className={`column-${columnTypes[columnIndex]}`}
        columnIndex={columnIndex}
        rowIndex={rowIndex}
      >
        {sortedData[rowIndex][columnKey]}
      </Cell>;
    const menuRenderer = () =>
      <Menu>
        <MenuItem
          icon="sort-asc"
          onClick={() => [setSortKey(columnKey), setSortDescending(false)]}
          text={t("table_view.sort_asc")}
        />
        <MenuItem
          icon="sort-desc"
          onClick={() => [setSortKey(columnKey), setSortDescending(true)]}
          text={t("table_view.sort_desc")}
        />
      </Menu>;
    const columnHeaderCellRenderer = () =>
      <ColumnHeaderCell name={columnKey} menuRenderer={menuRenderer} />;
    return (
      <Column
        cellRenderer={cellRenderer}
        columnHeaderCellRenderer={columnHeaderCellRenderer}
        key={columnKey}
        id={columnKey}
        name={columnKey}
      />
    );
  });

  return (
    <Table
      className={classNames("data-table", props.className)}
      enableColumnResizing={true}
      // enableGhostCells={true}
      // enableMultipleSelection={false}
      enableRowResizing={false}
      getCellClipboardData={(rowIndex, colIndex) =>
        sortedData[rowIndex][columnKeys[colIndex]]
      }
      numRows={sortedData.length}
      rowHeights={sortedData.map(() => 22)}
    >
      {columns}
    </Table>
  );
};

export default ResultTable;
