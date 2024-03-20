import {Alert, Box, Menu} from "@mantine/core";
import {IconAlertCircle, IconCircle, IconCircleCheck} from "@tabler/icons-react";
import {MRT_ColumnDef as ColumnDef, MantineReactTable, MRT_TableOptions as TableOptions, useMantineReactTable} from "mantine-react-table";
import React, {useMemo, useState} from "react";
import {useFormatter} from "../hooks/formatter";
import {useTranslation} from "../hooks/translation";
import {AnyResultColumn} from "../utils/structs";
import {ViewProps} from "../utils/types";

/** */
export function TableView<TData extends Record<string, any>>(props: {

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
} & ViewProps<TData> & TableOptions<TData>) {
  const {
    cube,
    result,
    columnFilter = () => true,
    columnSorting = () => 0,
    ...mantineReactTableProps
  } = props;
  const {types} = result;

  const data = useMemo(() => window.navigator.userAgent.includes("Firefox")
    ? result.data.slice(0, 10000)
    : result.data
  , [result.data]);

  const isLimited = result.data.length !== data.length;

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
        id: columnKey,
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
    enableBottomToolbar: isLimited,
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
    mantineBottomToolbarProps: {
      id: "query-results-table-view-footer"
    },
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
        height: "100%",
        display: "flex",
        flexFlow: "column nowrap",
        padding: `0 ${theme.spacing.sm}`,

        [theme.fn.largerThan("md")]: {
          padding: 0
        }
      })
    },
    mantineTableContainerProps: {
      id: "query-results-table-view-table",
      h: {base: "auto", md: 0},
      sx: {
        flex: "1 1 auto"
      }
    },
    mantineTopToolbarProps: {
      id: "query-results-table-view-toolbar",
      sx: {
        flex: "0 0 auto"
      }
    },
    renderBottomToolbar() {
      const [isOpen, setIsOpen] = useState(isLimited);
      if (!isOpen) return null;
      return (
        <Alert icon={<IconAlertCircle size="1rem" />} color="yellow" withCloseButton onClose={() => setIsOpen(false)}>{t("table_view.slicedresult")}</Alert>
      );
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
  }) as const, [isLimited]);

  const table = useMantineReactTable({
    ...constTableProps,
    ...mantineReactTableProps,
    columns,
    data
  });

  return <MantineReactTable table={table} />;
}

TableView.displayName = "TesseractExplorer:TableView";
