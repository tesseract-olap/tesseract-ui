import {Menu, MenuItem} from "@blueprintjs/core";
import {Cell, Column, ColumnHeaderCell, Table} from "@blueprintjs/table";
import classNames from "classnames";
import memoizeOne from "memoize-one";
import React, {PureComponent} from "react";
import {sortByKey} from "../utils/array";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {any[]} data
 */

/**
 * @typedef OwnState
 * @property {string} sortKey
 * @property {boolean} sortDescending
 */

/**
 * @type {PureComponent<OwnProps, OwnState>}
 */
class TableTabPanel extends PureComponent {
  state = {
    sortKey: "",
    sortDescending: true
  };

  cellClipboardData(data, keys, rowIndex, columnIndex) {
    return data[rowIndex][keys[columnIndex]];
  }

  dataSorter = memoizeOne(sortByKey);

  setSortingHandler(sortKey, sortDescending) {
    this.setState({sortKey, sortDescending});
  }

  render() {
    const {data} = this.props;
    const {sortDescending, sortKey} = this.state;

    /** @type {any[]} */
    const sortedData = this.dataSorter(data, sortKey, sortDescending);

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
      const menuRenderer = this.renderColumnMenu.bind(this, columnKey);
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

  renderColumnMenu(columnKey) {
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
      </Menu>
    );
  }
}

TableTabPanel.defaultProps = {
  data: []
};

export default TableTabPanel;
