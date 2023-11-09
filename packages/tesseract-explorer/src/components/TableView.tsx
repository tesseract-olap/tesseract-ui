import {Box, Menu} from "@mantine/core";
import {IconCircle, IconCircleCheck} from "@tabler/icons-react";
import {MantineReactTable, MRT_TableOptions as TableOptions, useMantineReactTable, type MRT_ColumnDef as ColumnDef} from "mantine-react-table";
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {useFormatter} from "../hooks/formatter";
import {useTranslation} from "../hooks/translation";
import {selectIsPreviewMode} from "../state/queries";
import {AnyResultColumn} from "../utils/structs";
import {type ViewProps} from "./ExplorerResults";

export const TableView = <TData extends Record<string, any>>(props: {

  /**
   * Defines which columns will be rendered and which will be hidden.
   * The function will be used as parameter for Array#filter() over a list
   * of descriptors for the columns.
   */
  columnFilter?: (column: AnyResultColumn) => boolean;

  /**
   * Defines the order in which the columns will be rendered.
   * The function will be used as parameter for Array#sort() over a list of
   * descriptors for the columns.
   */
  columnSorting?: (a: AnyResultColumn, b: AnyResultColumn) => number;
} & ViewProps<TData> & TableOptions<TData>) => {
  const {
    cube,
    result,
    columnFilter = () => true,
    columnSorting = () => 0,
    ...mantineReactTableProps
  } = props;
  const {data, types} = result;

  const isPreviewMode = useSelector(selectIsPreviewMode);
  const {translate: t} = useTranslation();

  const {
    currentFormats,
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
  const columns = useMemo<ColumnDef<TData>[]>(() => {
    const finalKeys = Object.values(types).filter(columnFilter).sort(columnSorting);
    return finalKeys.map(column => {
      const {entity, label: columnKey, localeLabel: header, valueType} = column;
      const isNumeric = valueType === "number";

      const formatterKey =
        getFormatterKey(columnKey) || (isNumeric ? "Decimal" : "identity");
      const formatter = getFormatter(formatterKey);

      return {
        entity, header, formatter, formatterKey, isNumeric,
        dataType: valueType,
        accessorFn: item => item[columnKey],
        Cell: isNumeric
          ? ({cell}) => formatter(cell.getValue<number>())
          : ({renderedCellValue}) => renderedCellValue,
        mantineTableBodyCellProps: {
          align: isNumeric ? "right" : "left"
        }
      };
    });
  }, [currentFormats, data, types]);

  const constTableProps = useMemo(() => ({
    enableBottomToolbar: false,
    enableColumnFilterModes: true,
    enableColumnResizing: true,
    enableDensityToggle: false,
    enableFilterMatchHighlighting: true,
    enableGlobalFilter: true,
    enablePagination: false,
    enableRowNumbers: true,
    enableRowVirtualization: true,
    globalFilterFn: "contains",
    initialState: {density: "xs"},
    mantineTableProps: {
      sx: {
        "& td": {
          padding: "7px 10px!important"
        }
      },
      withColumnBorders: true
    },
    mantinePaperProps: {
      id: "query-results-table-view",
      withBorder: false,
      sx: theme => ({
        [theme.fn.smallerThan("md")]: {
          padding: theme.spacing.sm
        }
      })
    },
    mantineTableContainerProps: {
      id: "query-results-table-view-table",
      sx: {
        // TODO: Find a better way to calculate the max height of Mantine React Table
        maxHeight: isPreviewMode
          ? "clamp(350px, calc(100vh - 56px - 48px - 48px), 9999px)"
          : "clamp(350px, calc(100vh - 56px - 48px), 9999px)"
      }
    },
    mantineTopToolbarProps: {
      id: "query-results-table-view-toolbar",
      sx: theme => ({
        [theme.fn.smallerThan("md")]: {
          padding: 0
        }
      })
    },
    renderColumnActionsMenuItems({column}) {
      if (!column?.columnDef?.isNumeric) return null;
      return (
        <Box>
          <Menu.Label>{t("table_view.numeral_format")}</Menu.Label>
          {column?.columnDef?.isNumeric && getAvailableKeys(column?.columnDef?.accessorKey).map(key =>
            <Menu.Item
              key={key}
              icon={column?.columnDef?.formatterKey === key ? <IconCircleCheck /> : <IconCircle />}
              onClick={() => setFormat(column?.columnDef?.accessorKey, key)}
            >
              {getFormatter(key)(12345.678)}
            </Menu.Item>
          )}
          <Menu.Divider />
        </Box>);
    },
    rowVirtualizerProps: {
      measureElement() {
        return 37;
      }
    }
  }) as const, [isPreviewMode]);

  const table = useMantineReactTable({
    ...constTableProps,
    ...mantineReactTableProps,
    columns,
    data
  });

  return <MantineReactTable table={table} />;
};

TableView.displayName = "TesseractExplorer:TableView";