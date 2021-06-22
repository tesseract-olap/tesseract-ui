export const SERIAL_BOOLEAN = {
  DEBUG: 1,
  DISTINCT: 2,
  NONEMPTY: 4,
  PARENTS: 8,
  SPARSE: 16,
  EXCLUDE_DEFAULT_MEMBERS: 32
};

export const Comparison = {
  EQ: "=",
  GT: ">",
  GTE: ">=",
  LT: "<",
  LTE: "<=",
  NEQ: "!="
};

export const orderOptions = [
  {value: "desc", label: "descending"},
  {value: "asc", label: "ascending"}
];

export const chartInterfaces = {
  BarChart: "BarChartConfig",
  LinePlot: "LinePlotConfig",
  StackedArea: "StackedAreaConfig",
  Treemap: "TreemapConfig",
  Geomap: "GeomapConfig",
  Sankey: "SankeyConfig",
  Radar: "RadarConfig",
  Priestley: "PriestleyConfig",
  Network: "NetworkConfig",
  Donut: "DonutConfig"
};

export const chartOptions = Object.keys(chartInterfaces);
