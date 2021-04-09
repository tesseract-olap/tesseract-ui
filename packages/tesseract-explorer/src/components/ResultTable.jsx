import {Menu, MenuDivider, MenuItem} from "@blueprintjs/core";
import {Cell, Column, ColumnHeaderCell, Table} from "@blueprintjs/table";
import classNames from "classnames";
import React, {useMemo, useState} from "react";
import {useFormatter} from "../hooks/formatter";
import {useTranslation} from "../hooks/translation";
import {sortByKey} from "../utils/array";
import {isNumeric} from "../utils/validation";

/** @type {React.FC<TessExpl.ViewProps>} */
const ResultTable = props => {
  const {data = []} = props.result;
  const {measures} = props.cube;

  const {
    getAvailableKeys,
    getFormatter,
    getFormatterKey,
    setFormat
  } = useFormatter(measures);
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
    const columnType = columnTypes[columnIndex];
    // prettier-ignore
    const formatterKey = getFormatterKey(columnKey) ||
                         (columnType === "number" ? "Decimal" : "identity");
    const formatter = getFormatter(formatterKey);

    const cellRenderer = rowIndex => {
      const value = sortedData[rowIndex][columnKey];
      return (
        <Cell
          className={`column-${columnType}`}
          columnIndex={columnIndex}
          rowIndex={rowIndex}
        >
          {isNumeric(value) ? formatter(value) : value}
        </Cell>
      );
    };

    const renderFormatterOptions = () => getAvailableKeys(columnKey)
      .map(key =>
        <MenuItem
          key={key}
          icon={formatterKey === key ? "selection" : "circle"}
          onClick={() => setFormat(columnKey, key)}
          text={getFormatter(key)(12345.678)}
        />
      );

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

  const tableKey = useMemo(() => {
    const formatters = measures.map(item => getFormatterKey(item.name)).join(",");
    return `${props.result.urlLogicLayer}&formatters=${formatters}&tablesort=${sortKey}.${sortDescending ? "desc" : "asc"}`;
  }, [measures]);

  return (
    <Table
      className={classNames("data-table", props.className)}
      key={tableKey}
      enableColumnResizing={true}
      // enableGhostCells={true}
      // enableMultipleSelection={false}
      enableRowResizing={false}
      getCellClipboardData={(rowIndex, colIndex) => {
        const measureName = columnKeys[colIndex];
        const value = sortedData[rowIndex][measureName];
        if (typeof value !== "number") return value;
        const formatterKey = getFormatterKey(measureName) || "Decimal";
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
