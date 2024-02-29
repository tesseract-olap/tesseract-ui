import {Level, Measure} from "@datawheel/olap-client";
import {ViewProps, useSettings, useTranslation} from "@datawheel/tesseract-explorer";
import {ChartLimits, ChartType, D3plusConfig, generateCharts} from "@datawheel/vizbuilder";
import {Box, Modal, SimpleGrid, Title} from "@mantine/core";
import cls from "clsx";
import React, {useCallback, useMemo} from "react";
import {measureConfigAccessor} from "../tooling/accesor";
import {mapActives} from "../tooling/collection";
import {DEFAULT_CHART_LIMITS} from "../tooling/constants";
import {ChartCard} from "./ChartCard";

/**
 * Vizbuilder PanelView component factory function.
 */
export function createVizbuilderView(settings: {
  readonly chartTypes?: ChartType[];
  readonly chartLimits?: Partial<ChartLimits>;
  readonly datacap?: number;
  readonly defaultLocale?: string;
  readonly downloadFormats?: string[];
  readonly measureConfig?: Record<string, D3plusConfig> | ((measure: Measure) => D3plusConfig);
  readonly nonIdealState?: React.ComponentType,
  readonly showConfidenceInt?: boolean;
  readonly topojsonConfig?: Record<string, D3plusConfig> | ((level: Level) => D3plusConfig);

  /**
   * A global d3plus config that gets applied on all charts.
   * Has priority over the individually generated configs per chart,
   * but can be overridden by internal working configurations.
   */
  readonly userConfig?: D3plusConfig;
}) {
  const {
    chartTypes,
    datacap,
    defaultLocale = "en",
    downloadFormats,
    nonIdealState: Notice = NonIdealState,
    showConfidenceInt = false,
    topojsonConfig,
    userConfig = {}
  } = settings;

  const getMeasureConfig = measureConfigAccessor(settings.measureConfig || {});
  const chartLimits = {...DEFAULT_CHART_LIMITS, ...settings.chartLimits};
  const chartGenOptions = {chartLimits, chartTypes, datacap, topojsonConfig};

  VizbuilderView.defaultProps = {
    version: process.env.BUILD_VERSION
  };

  return VizbuilderView;

  /** Enclosed PanelView component. */
  function VizbuilderView(props: ViewProps) {
    const {cube, panelKey, params, result} = props;

    const {actions, formatters} = useSettings();

    const [panelName, currentChart] = useMemo(() => `${panelKey || ""}-`.split("-"), [panelKey]);

    const resetCurrentPanel = useCallback(() => {
      actions.switchPanel(panelName);
    }, [panelName]);

    const charts = useMemo(() => generateCharts([{
      cube,
      dataset: result.data,
      params: {
        locale: params.locale || defaultLocale,
        booleans: params.booleans,
        cuts: mapActives(params.cuts, item => ({
          dimension: item.dimension,
          hierarchy: item.hierarchy,
          level: item.level,
          members: item.members
        })),
        drilldowns: mapActives(params.drilldowns, item => ({
          caption: item.captionProperty,
          dimension: item.dimension,
          hierarchy: item.hierarchy,
          level: item.level,
          properties: item.properties.map(item => item.name)
        })),
        filters: mapActives(params.filters, item => ({
          constraint1: [item.conditionOne[0], item.conditionOne[2]],
          constraint2: item.conditionTwo
            ? [item.conditionTwo[0], item.conditionTwo[2]]
            : undefined,
          formatter: formatters[item.measure],
          joint: item.joint,
          measure: item.measure
        })),
        measures: mapActives(params.measures, item => ({
          formatter: formatters[item.name],
          measure: item.name
        }))

      }
    }], chartGenOptions), [cube, result.data, params]);

    const content = useMemo(() => {
      const isSingleChart = charts.length === 1;
      const chartMap = new Map(charts.map(item => [item.key, item]));
      const filteredCharts = [...chartMap.values()];

      if (filteredCharts.length === 0) return <Notice />;

      return (
        <SimpleGrid
          breakpoints={[
            {minWidth: "xs", cols: Math.min(1, filteredCharts.length)},
            {minWidth: "md", cols: Math.min(2, filteredCharts.length)},
            {minWidth: "lg", cols: Math.min(3, filteredCharts.length)},
            {minWidth: "xl", cols: Math.min(4, filteredCharts.length)}
          ]}
          className={cls({unique: filteredCharts.length === 1})}
        >
          {filteredCharts.map(chart =>
            <ChartCard
              chart={chart}
              currentChart={""}
              downloadFormats={downloadFormats}
              isSingleChart={isSingleChart}
              key={chart.key}
              measureConfig={getMeasureConfig}
              onToggle={() => {
                actions.switchPanel(`${panelName}-${chart.key}`);
              }}
              showConfidenceInt={showConfidenceInt}
              userConfig={userConfig}
            />
          )}
        </SimpleGrid>
      );
    }, [currentChart, charts]);

    const focusContent = useMemo(() => {
      const chart = charts.find(chart => currentChart && chart.key === currentChart);
      if (!chart) return null;

      return (
        <ChartCard
          chart={chart}
          currentChart={currentChart}
          downloadFormats={downloadFormats}
          isSingleChart={true}
          key={`${chart.key}-focus`}
          measureConfig={getMeasureConfig}
          onToggle={resetCurrentPanel}
          showConfidenceInt={showConfidenceInt}
          userConfig={userConfig}
        />
      );

    }, [currentChart, charts]);

    return (
      <Box className={props.className} p="sm">
        {content}
        <Modal
          centered
          onClose={resetCurrentPanel}
          opened={currentChart !== ""}
          padding={0}
          size="calc(100vw - 3rem)"
          styles={{
            content: {maxHeight: "none !important"},
            inner: {padding: "0 !important"}
          }}
          withCloseButton={false}
        >
          {focusContent}
        </Modal>
      </Box>
    );
  }
}

/** */
function NonIdealState() {
  const {translate: t} = useTranslation();

  return <Box className="vizbuilder-nonidealstate">
    <Title order={1} className="vizbuilder-nonidealstate-header">
      {t("nonidealstate_msg")}
    </Title>
  </Box>;
}
