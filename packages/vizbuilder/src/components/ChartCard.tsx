import {Measure} from "@datawheel/olap-client";
import {useTranslation} from "@datawheel/tesseract-explorer";
import {Chart, ChartType, D3plusConfig, createChartConfig} from "@datawheel/vizbuilder";
import {Box, Button, Group, Paper, Stack} from "@mantine/core";
import {IconArrowsMaximize, IconArrowsMinimize, IconDownload, IconPhotoDown, IconVectorTriangle} from "@tabler/icons-react";
import {saveElement} from "d3plus-export";
import {BarChart, Donut, Geomap, LinePlot, Pie, StackedArea, Treemap} from "d3plus-react";
import React, {useMemo, useRef} from "react";
import {asArray} from "../tooling/collection";
import {ErrorBoundary} from "./ErrorBoundary";

export const chartComponents: Record<ChartType, React.ComponentType<{config: any}>> = {
  barchart: BarChart,
  barchartyear: BarChart,
  donut: Donut,
  geomap: Geomap,
  histogram: BarChart,
  lineplot: LinePlot,
  pie: Pie,
  stacked: StackedArea,
  treemap: Treemap
};

const iconByFormat = {
  jpg: IconPhotoDown,
  png: IconPhotoDown,
  svg: IconVectorTriangle
};

/**  */
export function ChartCard(props: {
  chart: Chart;
  currentChart: string;
  downloadFormats?: string[] | undefined;
  isSingleChart: boolean;
  measureConfig: (item: Measure) => D3plusConfig;
  onToggle: () => void;
  showConfidenceInt: boolean;
  userConfig: D3plusConfig;
}) {
  const {chart, currentChart, isSingleChart} = props;
  const isFocused = currentChart === chart.key;

  const {translate, locale} = useTranslation();

  const nodeRef = useRef<HTMLDivElement | null>(null);

  const ChartComponent = chartComponents[chart.chartType];

  const config = useMemo(() => createChartConfig(chart, {
    currentChart,
    isSingleChart,
    isUniqueChart: isSingleChart,
    measureConfig: props.measureConfig,
    showConfidenceInt: Boolean(props.showConfidenceInt),
    translate: (template, data) => translate(`vizbuilder.${template}`, data),
    userConfig: props.userConfig || {}
  }), [chart, isSingleChart, locale]);

  const downloadButtons = useMemo(() => {
    if (!isFocused && !isSingleChart) return [];

    const filename = (config.title instanceof Function ? config.title() : config.title)
      // and replace special characters with underscores
      .replace(/[^\w]/g, "_")
      .replace(/[_]+/g, "_");

    return asArray(props.downloadFormats).map(format => {
      const formatLower = format.toLowerCase();
      const Icon = iconByFormat[formatLower] || IconDownload;
      return (
        <Button
          compact
          key={format}
          leftIcon={<Icon size={16} />}
          onClick={() => {
            const {current: boxElement} = nodeRef;
            const svgElement = boxElement && boxElement.querySelector("svg");
            svgElement && saveElement(svgElement, {filename, type: formatLower}, {
              background: getBackground(svgElement)
            });
          }}
          size="sm"
          variant="light"
        >
          {format.toUpperCase()}
        </Button>
      );
    });
  }, [isFocused, isSingleChart, props.downloadFormats]);

  const focusButton = useMemo(() => {
    if (!isFocused && isSingleChart) return null;

    const Icon = isFocused ? IconArrowsMinimize : IconArrowsMaximize;
    return (
      <Button
        compact
        leftIcon={<Icon size={16} />}
        onClick={props.onToggle}
        size="sm"
        variant={isFocused ? "filled" : "light"}
      >
        {isFocused
          ? translate("vizbuilder.action_close")
          : translate("vizbuilder.action_enlarge")}
      </Button>
    );
  }, [isFocused, isSingleChart, locale, props.onToggle]);

  const height = isFocused ? "calc(100vh - 3rem)" : isSingleChart ? "75vh" : 300;

  return (
    <Paper h={height} w="100%" style={{overflow: "hidden"}}>
      <ErrorBoundary>
        <Stack spacing={0} h={height} style={{position: "relative"}} w="100%">
          <Group position="right" p="xs" spacing="xs" align="center">
            {downloadButtons}
            {focusButton}
          </Group>
          <Box style={{flex: "1 1 auto"}} ref={nodeRef} pb="xs" px="xs">
            <ChartComponent config={config} />
          </Box>
        </Stack>
      </ErrorBoundary>
    </Paper>
  );
}

const getBackground = node => {
  if (node.nodeType !== Node.ELEMENT_NODE) return "white";
  const styles = window.getComputedStyle(node);
  const color = styles.getPropertyValue("background-color");
  return color && color !== "rgba(0, 0, 0, 0)" && color !== "transparent"
    ? color
    : getBackground(node.parentNode);
};
