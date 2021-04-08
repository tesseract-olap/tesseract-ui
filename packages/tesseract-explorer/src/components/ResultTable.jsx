import {Menu, MenuDivider, MenuItem} from "@blueprintjs/core";
import {Cell, Column, Table} from "@blueprintjs/table";
import classNames from "classnames";
import {format} from "d3plus-format";
import React, {useMemo, useState} from "react";
import {filterMap, sortByKey} from "../utils/array";
import {defaultFormatters, useFormatter} from "../utils/format";
import {useTranslation} from "../utils/localization";
import {ColumnHeaderCell} from "./ColumnHeaderCell";

/** @type {React.FC<TessExpl.ViewProps>} */
const ResultTable = props => {
  const {data = []} = props.result;

  const {translate: t} = useTranslation();

  const [sortKey, setSortKey] = useState("");
  const [sortDescending, setSortDescending] = useState(true);
  const [formatTemplates, userFormats, setUserFormats] = useFormatter(props.cube.measures);

  const sortedData = useMemo(
    () => sortByKey(data.slice(), sortKey, sortDescending),
    [data, sortKey, sortDescending]
  );

  const getFormatter = key => defaultFormatters[key] || format(key);

  const columnKeys = Object.keys(sortedData[0]);
  const columnTypes = columnKeys.map(key => typeof sortedData[0][key]);

  const columns = columnKeys.map((columnKey, columnIndex) => {
    const columnType = columnTypes[columnIndex];
    // prettier-ignore
    const formatterKey = userFormats[columnKey] ||
                         formatTemplates[columnKey] ||
                         (columnType === "number" ? "Decimal" : "identity");
    const formatter = getFormatter(formatterKey);

    const renderFormatterOptions = () => filterMap(
      Object.keys(defaultFormatters).concat(formatTemplates[columnKey] || ""),
      (formatKey, index, list) => {
        if (!formatKey || formatKey === "identity" || list.indexOf(formatKey) !== index) {
          return null;
        }
        const formatter = getFormatter(formatKey);
        return (
          <MenuItem
            key={formatKey}
            icon={formatterKey === formatKey ? "selection" : "circle"}
            onClick={() => setUserFormats({...userFormats, [columnKey]: formatKey})}
            text={formatter(12345.678)}
          />
        );
      }
    );

    const cellRenderer = rowIndex =>
      <Cell
        className={`column-${columnType}`}
        columnIndex={columnIndex}
        rowIndex={rowIndex}
      >
        {formatter(sortedData[rowIndex][columnKey])}
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
        {columnType === "number" && <MenuDivider title={t("table_view.numeral_format")} />}
        {columnType === "number" && renderFormatterOptions()}
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

  const tableKey = `${props.result.urlLogicLayer}&formatters=${Object.values(userFormats).join(",")}&tablesort=${sortKey}.${sortDescending ? "desc" : "asc"}`;

  return (
    <Table
      className={classNames("data-table", props.className)}
      key={tableKey}
      enableColumnResizing={true}
      // enableGhostCells={true}
      // enableMultipleSelection={false}
      enableRowResizing={false}
      getCellClipboardData={(rowIndex, colIndex) => {
        const columnKey = columnKeys[colIndex];
        const value = sortedData[rowIndex][columnKey];
        if (columnTypes[colIndex] !== "number") {
          return value;
        }
        // prettier-ignore
        const formatterKey = userFormats[columnKey] ||
                             formatTemplates[columnKey] ||
                             "Decimal";
        const formatter = getFormatter(formatterKey);
        return formatter(value);
      }}
      numRows={sortedData.length}
      rowHeights={sortedData.map(() => 22)}
    >
      {columns}
    </Table>
  );
};

export default ResultTable;
