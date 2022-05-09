import {Menu, MenuDivider, MenuItem} from "@blueprintjs/core";
import {Cell, Column, ColumnHeaderCell, Table} from "@blueprintjs/table";
import clsx from "classnames";
import React, {useCallback, useMemo, useState} from "react";
import {useFormatter} from "../hooks/formatter";
import {useTranslation} from "../hooks/translation";
import {filterMap, sortByKey} from "../utils/array";
import {getCaption} from "../utils/string";

/** @type {React.FC<TessExpl.ViewProps>} */
export const TableView = props => {
  const {cube, params, result} = props;
  const data = result.data;
  const locale = params.locale;

  const {translate: t} = useTranslation();

  const {
    getAvailableKeys,
    getFormatter,
    getFormatterKey,
    setFormat
  } = useFormatter(cube.measures);

  /**
   * This array contains a list of all the columns to be presented in the Table
   * Each item is an object containing useful information related to the column
   * and its contents, for later use.
   */
  const columns = useMemo(() => {
    const firstDatum = data[0];
    const findEntity = entityFinderFactory(cube, params);

    return Object.keys(firstDatum).map(columnKey => {
      const dataType = typeof firstDatum[columnKey];

      const formatterKey =
        getFormatterKey(columnKey) || (dataType === "number" ? "Decimal" : "identity");
      const formatter = getFormatter(formatterKey);

      const entity = findEntity(columnKey);
      const isIdColumn = entity && ( // Use of uniqueName might cause a bug here
        columnKey.endsWith(" ID") && !entity.name.endsWith(" ID") ||
        columnKey.startsWith("ID ") && !entity.name.startsWith("ID ")
      );
      const caption = entity
        ? getCaption(entity, locale) + (isIdColumn ? " ID" : "")
        : columnKey;
      const isNumeric = entity
        ? entity._type === "measure"
        : isIdColumn && dataType === "number";

      return {columnKey, dataType, entity, caption, formatter, formatterKey, isNumeric};
    });
  }, [cube, data, locale, params]);

  const [sortKey, setSortKey] = useState("");
  const [sortDescending, setSortDescending] = useState(true);
  const sortedData = useMemo(
    () => sortByKey(data.slice(), sortKey, sortDescending),
    [data, sortKey, sortDescending]
  );

  /**
   * This handler function returns the cell values when the user copies the
   * values from the table using `Cmd + C`
   * @type {(row: number, col: number) => string}
   */
  const cellClipboardHandler = useCallback((rowIndex, colIndex) => {
    const column = columns[colIndex];
    const value = sortedData[rowIndex][column.columnKey];
    return column.formatter(value);
  }, [sortedData, columns]);

  /**
   * This is the JSX for each column to be rendered.
   * The rules and interfaces are defined by the `@blueprintjs/table` package.
   */
  const jsx = useMemo(() => columns.map(column => {
    const {dataType, caption, formatter, formatterKey, isNumeric, columnKey} = column;

    const cellRenderer = (rowIndex, colIndex) => {
      const value = sortedData[rowIndex][columnKey];
      return (
        <Cell className={`column-${dataType}`} columnIndex={colIndex} rowIndex={rowIndex}>
          {formatter(value)}
        </Cell>
      );
    };

    const columnHeaderCellRenderer = colIndex =>
      <ColumnHeaderCell index={colIndex} name={caption} menuRenderer={menuRenderer} />;

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
        {isNumeric && <MenuDivider title={t("table_view.numeral_format")} />}
        {isNumeric && getAvailableKeys(columnKey).map(key =>
          <MenuItem
            key={key}
            icon={formatterKey === key ? "selection" : "circle"}
            onClick={() => setFormat(columnKey, key)}
            text={getFormatter(key)(12345.678)}
          />
        )}
      </Menu>;

    return (
      <Column
        cellRenderer={cellRenderer}
        columnHeaderCellRenderer={columnHeaderCellRenderer}
        key={columnKey}
        id={columnKey}
        name={caption}
      />
    );
  }), [sortedData, columns]);

  return (
    <Table
      className={clsx("data-table", props.className)}
      enableColumnResizing={true}
      // enableGhostCells={true}
      // enableMultipleSelection={false}
      enableRowResizing={false}
      getCellClipboardData={cellClipboardHandler}
      numRows={sortedData.length}
      rowHeights={sortedData.map(() => 22)}
    >
      {jsx}
    </Table>
  );
};

TableView.displayName = "TesseractExplorer:TableView";

/**
 * Creates an index for the Measures, Levels, and Properties involved in the
 * query, and returns a function to quickly get the entity by its name.
 *
 * @param {OlapClient.PlainCube} cube
 * @param {TessExpl.Struct.QueryParams} params
 */
function entityFinderFactory(cube, params) {
  const measureMap = Object.fromEntries(
    cube.measures.map(msr => [msr.name, msr])
  );
  const levelMap = Object.fromEntries(
    cube.dimensions.map(dim => [dim.name, Object.fromEntries(
      dim.hierarchies.map(hie => [hie.name, Object.fromEntries(
        hie.levels.map(lvl => [lvl.name, lvl])
      )])
    )])
  );

  const measures = Object.values(params.measures)
    .map(item => measureMap[item.measure]);

  const drilldowns = Object.values(params.drilldowns).flatMap(item => {
    const level = levelMap[item.dimension][item.hierarchy][item.level];
    return [level, ...filterMap(item.properties, prop => prop.active
      ? level.properties.find(item => item.name === prop.name) || null
      : null
    )];
  });

  return name => {
    const nameWoId = name.replace(/^ID\s|\sID$/, "");
    return (
      drilldowns.find(item => item.uniqueName === name) ||
      measures.find(item => item.name === name) ||
      drilldowns.find(item => item.name === name) ||
      drilldowns.find(item => item.uniqueName === nameWoId) ||
      measures.find(item => item.name === nameWoId) ||
      drilldowns.find(item => item.name === nameWoId)
    );
  };
}
