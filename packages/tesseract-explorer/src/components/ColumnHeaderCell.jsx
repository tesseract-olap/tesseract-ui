import {Icon, Popover, Position} from "@blueprintjs/core";
import {HorizontalCellDivider} from "@blueprintjs/table";
import {columnInteractionBarContextTypes} from "@blueprintjs/table/lib/esm/common/context";
import {LoadableContent} from "@blueprintjs/table/lib/esm/common/loadableContent";
import {CLASSNAME_EXCLUDED_FROM_TEXT_MEASUREMENT} from "@blueprintjs/table/lib/esm/common/utils";
import {HeaderCell} from "@blueprintjs/table/lib/esm/headers/headerCell";
import {TABLE_COLUMN_HEADER_CELL, TABLE_COLUMN_NAME, TABLE_COLUMN_NAME_TEXT, TABLE_HAS_INTERACTION_BAR, TABLE_HAS_REORDER_HANDLE, TABLE_HEADER, TABLE_HEADER_CONTENT, TABLE_INTERACTION_BAR, TABLE_TH_MENU, TABLE_TH_MENU_CONTAINER, TABLE_TH_MENU_CONTAINER_BACKGROUND, TABLE_TH_MENU_OPEN, TABLE_TRUNCATED_TEXT} from "@blueprintjs/table/lib/esm/common/classes";
import classNames from "classnames";
import React, {useState} from "react";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<import("@blueprintjs/table").IColumnHeaderCellProps>} */
export const ColumnHeaderCell = props => {
  const {
    // from IColumnHeaderCellProps
    enableColumnReordering,
    isColumnSelected,
    menuIcon = "chevron-down",

    // from IColumnNameProps
    name,
    nameRenderer,

    // from IHeaderProps
    ...spreadableProps
  } = props;

  const [isActive, setIsActive] = useState(false);

  const enableColumnInteractionBar = false;

  const classes = classNames(spreadableProps.className, TABLE_COLUMN_HEADER_CELL, {
    [TABLE_HAS_INTERACTION_BAR]: enableColumnInteractionBar,
    [TABLE_HAS_REORDER_HANDLE]: props.reorderHandle != null
  });

  const maybeRenderContent = () => props.children === null
    ? undefined
    : <div className={TABLE_HEADER_CONTENT}>{props.children}</div>;

  const maybeRenderDropdownMenu = () => {
    const {index, menuIcon, menuRenderer} = props;

    if (typeof menuRenderer !== "function") {
      return undefined;
    }

    const classes = classNames(
      TABLE_TH_MENU_CONTAINER,
      CLASSNAME_EXCLUDED_FROM_TEXT_MEASUREMENT,
      {[TABLE_TH_MENU_OPEN]: isActive}
    );

    return (
      <div className={classes}>
        <div className={TABLE_TH_MENU_CONTAINER_BACKGROUND} />
        <Popover
          content={menuRenderer(index)}
          position={Position.BOTTOM}
          className={TABLE_TH_MENU}
          modifiers={{preventOverflow: {boundariesElement: "viewport"}}}
          onOpened={() => setIsActive(true)}
          onClosing={() => setIsActive(false)}
        >
          <Icon icon={menuIcon} />
        </Popover>
      </div>
    );
  };

  const renderName = () => {
    const {index, loading, name, nameRenderer, reorderHandle} = props;

    const dropdownMenu = maybeRenderDropdownMenu();
    const defaultName = <div className={TABLE_TRUNCATED_TEXT}>{name}</div>;

    const nameComponent =
      <LoadableContent loading={loading} variableLength={true}>
        {nameRenderer == null ? defaultName : nameRenderer(name, index)}
      </LoadableContent>;

    if (enableColumnInteractionBar) {
      return (
        <div className={TABLE_COLUMN_NAME} title={name}>
          <div className={TABLE_INTERACTION_BAR}>
            {reorderHandle}
            {dropdownMenu}
          </div>
          <HorizontalCellDivider />
          <div className={TABLE_COLUMN_NAME_TEXT}>{nameComponent}</div>
        </div>
      );
    }
    else {
      return (
        <div className={TABLE_COLUMN_NAME} title={name}>
          {reorderHandle}
          {dropdownMenu}
          <div className={TABLE_COLUMN_NAME_TEXT}>{nameComponent}</div>
        </div>
      );
    }
  };

  return (
    <HeaderCell
      isReorderable={props.enableColumnReordering}
      isSelected={props.isColumnSelected}
      {...spreadableProps}
      className={classes}
    >
      {renderName()}
      {maybeRenderContent()}
      {props.loading ? undefined : props.resizeHandle}
    </HeaderCell>
  );
};


/**
 * This method determines if a `MouseEvent` was triggered on a target that
 * should be used as the header click/drag target. This enables users of
 * this component to render fully interactive components in their header
 * cells without worry of selection or resize operations from capturing
 * their mouse events.
 */
ColumnHeaderCell.isHeaderMouseTarget = target =>
  target.classList.contains(TABLE_HEADER) ||
  target.classList.contains(TABLE_COLUMN_NAME) ||
  target.classList.contains(TABLE_INTERACTION_BAR) ||
  target.classList.contains(TABLE_HEADER_CONTENT);

ColumnHeaderCell.defaultProps = {
  isActive: false,
  menuIcon: "chevron-down"
};

ColumnHeaderCell.contextTypes = columnInteractionBarContextTypes;
