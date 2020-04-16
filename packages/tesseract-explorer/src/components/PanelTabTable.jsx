import {NonIdealState, Menu, MenuItem, MenuDivider} from "@blueprintjs/core";
import {Cell, Column, Table, ColumnHeaderCell} from "@blueprintjs/table";
import classNames from "classnames";
import memoizeOne from "memoize-one";
import React, {PureComponent} from "react";
import {sortByKey} from "../utils/array";
import {formatAbbreviate} from "d3plus-format";

const formatters = {
  identity: n => `${n}`,
  decimal: new Intl.NumberFormat(undefined, {useGrouping: false}).format,
  human: n => formatAbbreviate(n, "en-US"),
  million: new Intl.NumberFormat(undefined, {useGrouping: true}).format,
  usd: new Intl.NumberFormat(undefined, {style: "currency", currency: "USD"}).format
};

/**
 * @typedef OwnProps
 * @property {string} className
 */

/**
 * @typedef OwnState
 * @property {string} sortKey
 * @property {boolean} sortDescending
 */

/**
 * @type {PureComponent<import("../reducers/aggregationReducer").AggregationState & OwnProps>}
 */
class TableTabPanel extends PureComponent {
  state = {
    sortKey: "",
    sortDescending: true,
    numberFormats: {}
  };

  cellClipboardData(data, keys, rowIndex, columnIndex) {
    return data[rowIndex][keys[columnIndex]];
  }

  dataSorter = memoizeOne(sortByKey);

  setSortingHandler(sortKey, sortDescending) {
    this.setState({sortKey, sortDescending});
  }

  setNumberFormat(columnKey, format) {
    this.setState(state => ({
      numberFormats: {...state.numberFormats, [columnKey]: format}
    }));
  }

  render() {
    const {data} = this.props;
    const {numberFormats, sortDescending, sortKey} = this.state;

    if (data.length === 0) {
      return (
        <NonIdealState
          icon="issue"
          title="Empty dataset"
          description="The query didn't return elements. Try again with different parameters."
        />
      );
    }

    /** @type {any[]} */
    const sortedData = this.dataSorter(data, sortKey, sortDescending);

    const columnKeys = Object.keys(sortedData[0]);
    const columnTypes = columnKeys.map(key => typeof sortedData[0][key]);
    const columns = columnKeys.map((columnKey, columnIndex) => {
      const columnType = columnTypes[columnIndex];
      const formatterName = numberFormats[columnKey] || (columnType === "number" ? "decimal" : "identity");
      const formatter = formatters[formatterName];
      const cellRenderer = rowIndex =>
        <Cell
          className={`column-${columnType}`}
          columnIndex={columnIndex}
          rowIndex={rowIndex}
        >
          {formatter(sortedData[rowIndex][columnKey])}
        </Cell>;
      const menuRenderer = this.renderColumnMenu.bind(this, columnKey, columnType);
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

    const cellClipboardData = this.cellClipboardData.bind(null, sortedData, columnKeys);

    return (
      <Table
        className={classNames("data-table", this.props.className)}
        enableColumnResizing={true}
        // enableGhostCells={true}
        // enableMultipleSelection={false}
        enableRowResizing={false}
        getCellClipboardData={cellClipboardData}
        numRows={sortedData.length}
        rowHeights={sortedData.map(() => 22)}
      >
        {columns}
      </Table>
    );
  }

  /**
   * @param {string} columnKey
   * @param {"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"} columnType
   */
  renderColumnMenu(columnKey, columnType) {
    const formatName = this.state.numberFormats[columnKey] || "decimal";
    const numericOptions = columnType === "number" &&
      <React.Fragment>
        <MenuDivider title="Numeral format" />
        {["decimal", "million", "human", "usd"].map(format =>
          <MenuItem
            key={format}
            icon={formatName === format ? "selection" : "circle"}
            onClick={this.setNumberFormat.bind(this, columnKey, format)}
            text={formatters[format](12345.678)}
          />)}
      </React.Fragment>;

    return (
      <Menu>
        <MenuItem
          icon="sort-asc"
          onClick={this.setSortingHandler.bind(this, columnKey, false)}
          text="Sort Asc"
        />
        <MenuItem
          icon="sort-desc"
          onClick={this.setSortingHandler.bind(this, columnKey, true)}
          text="Sort Desc"
        />
        {numericOptions}
      </Menu>
    );
  }
}

TableTabPanel.defaultProps = {
  data: []
};

export default TableTabPanel;
