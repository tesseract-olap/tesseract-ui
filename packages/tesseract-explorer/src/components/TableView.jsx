import {Box, Menu} from "@mantine/core";
import {IconCircle, IconCircleCheck} from "@tabler/icons-react";
import {MantineReactTable} from "mantine-react-table";
import React, {useCallback, useMemo} from "react";
import {useSelector} from "react-redux";
import {useFormatter} from "../hooks/formatter";
import {useTranslation} from "../hooks/translation";
import {selectIsPreviewMode} from "../state/queries";
import {filterMap} from "../utils/array";
import {getCaption} from "../utils/string";

/** @type {React.FC<import("./ExplorerResults").ViewProps>} */
export const TableView = props => {
  const {cube, params, result, ...mantineReactTableProps} = props;
  const data = result.data;
  const locale = params.locale;

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
   *
   * @type {import("mantine-react-table").MRT_ColumnDef<typeof data[0]>[]}
   */
  const columns = useMemo(() => {
    const firstDatum = data[0];
    const findEntity = entityFinderFactory(cube, params);

    return Object.keys(firstDatum).map(columnKey => {
      const dataType = typeof firstDatum[columnKey];

      const formatterKey =
        getFormatterKey(columnKey) ||
        (dataType === "number" ? "Decimal" : "identity");
      const formatter = getFormatter(formatterKey);

      const entity = findEntity(columnKey);
      const isIdColumn = entity && ( // Use of uniqueName might cause a bug here
        columnKey.endsWith(" ID") && !entity.name.endsWith(" ID") ||
        columnKey.startsWith("ID ") && !entity.name.startsWith("ID ")
      );
      const header = entity
        ? getCaption(entity, locale) + (isIdColumn ? " ID" : "")
        : columnKey;
      const isNumeric = entity
        ? entity._type === "measure"
        : isIdColumn && dataType === "number";

      return {
        dataType, entity, header, formatter, formatterKey, isNumeric,
        accessorKey: columnKey,
        Cell: isNumeric
          ? ({cell}) => formatter(cell.getValue())
          : ({renderedCellValue}) => renderedCellValue,
        mantineTableBodyCellProps: {
          align: isNumeric ? "right" : "left"
        }
      };
    });
  }, [cube, currentFormats, data, locale, params]);

  const menuRenderer = useCallback(column => {
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
  }, []);

  return (
    <MantineReactTable
      columns={columns}
      data={data}
      enableBottomToolbar={false}
      enableColumnFilterModes
      enableColumnResizing
      enableDensityToggle={false}
      enableFilterMatchHighlighting
      enableGlobalFilter
      enablePagination={false}
      enableRowNumbers
      enableRowVirtualization
      globalFilterFn="contains"
      initialState={{
        density: "xs"
      }}
      mantineTableProps={{
        sx: {
          "& td": {
            padding: "7px 10px!important"
          }
        },
        withColumnBorders: true
      }}
      mantinePaperProps={{
        id: "query-results-table-view",
        withBorder: false,
        sx: theme => ({
          [theme.fn.smallerThan("md")]: {
            padding: theme.spacing.sm
          }
        })
      }}
      mantineTableContainerProps={{
        id: "query-results-table-view-table",
        sx: {
          // TODO: Find a better way to calculate the max height of Mantine React Table
          maxHeight: isPreviewMode
            ? "clamp(350px, calc(100vh - 56px - 48px - 48px), 9999px)"
            : "clamp(350px, calc(100vh - 56px - 48px), 9999px)"
        }
      }}
      mantineTopToolbarProps={{
        id: "query-results-table-view-toolbar",
        sx: theme => ({
          [theme.fn.smallerThan("md")]: {
            padding: 0
          }
        })
      }}
      renderColumnActionsMenuItems={({column}) => menuRenderer(column)}
      rowVirtualizerProps={{
        measureElement() {
          return 37;
        }
      }}
      {...mantineReactTableProps}
    />
  );
};

TableView.displayName = "TesseractExplorer:TableView";

/**
 * Creates an index for the Measures, Levels, and Properties involved in the
 * query, and returns a function to quickly get the entity by its name.
 *
 * @param {import("@datawheel/olap-client").PlainCube} cube
 * @param {import("../utils/structs").QueryParams} params
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

  const measures = Object.values(params.measures).map(item =>
    measureMap[item.name]
  );

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
