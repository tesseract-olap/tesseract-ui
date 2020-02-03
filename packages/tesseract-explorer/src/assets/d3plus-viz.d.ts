declare class Viz<T> extends BaseClass<T> {};

interface VizConfig<T> extends BaseClassConfig<T> {
  active([value])

  /**
   * Sets the aggregation method for each key in the data objects.
   * This is used to represent data slices in aggregated charts, legend labels and values, and others.
   */
  aggs: Record<keyof T, (datums: T[]) => StringLike>;

  /**
   * Sets the "aria-hidden" attribute of the containing SVG element.
   * The default value is "false", but if you need to hide the SVG from screen readers set this property to "true".
   */
  ariaHidden: boolean;

  // backConfig([value])
  // cache([value])
  // color([value])

  // colorScale([value])
  // colorScaleConfig([value])
  // colorScalePadding([value])
  // colorScalePosition([value])
  // colorScaleMaxSize([value])

  // controls([value])
  // controlConfig([value])
  // controlPadding([value])

  /** The dataset to work with. */
  data: T[];

  // dataCutoff([value])
  // depth([value])
  // detectResize(value)
  // detectResizeDelay(value)
  // detectVisible(value)
  // detectVisibleInterval(value)

  /** Sets the discrete accessor to the specified method name (usually an axis). */
  discrete: "x" | "y";

  // downloadButton([value])
  // downloadConfig([value])
  // downloadPosition([value])

  /** Time, in milliseconds, to run the animations. */
  duration: number;

  // filter([value])

  /** Sets the hierarchies to use to group datums in a visualization. */
  groupBy: Accessor<T>[];

  // height([value])
  // hiddenColor([value])
  // hiddenOpacity([value])

  /** Sets the hover method. */
  hover: () => void;

  /**  */
  label: Accessor<T>;

  /** Activates or deactivates the chart legend. */
  legend: boolean;

  /** An object that describes how the legend will be rendered. */
  legendConfig: Partial<LegendConfig<T>>;

  // legendCutoff([value])
  // legendTooltip([value])
  // legendPadding([value])
  // legendPosition([value])
  // legendSort(value)

  /**
   * Sets the inner HTML of the status message that is displayed when loading AJAX requests and displaying errors.
   * Must be a valid HTML string or a function that, when passed this Viz instance, returns a valid HTML string.
   */
  loadingHTML: string | ((instance: Viz<T>) => string);

  // loadingMessage([value])

  // messageMask([value])
  // messageStyle([value])
  // noDataHTML([value])
  // noDataMessage([value])
  // scrollContainer(selector)
  // select([selector])

  // shape([value])

  /**
   * Sets config values for all shapes rendered by this component.
   * Note you can set config properties for all shapes, and set a config for specific shapes using its Name as property name.
   */
  shapeConfig: Partial<ShapeConfig<T>>;

  /**
   * Sets a description for the visualization.
   * Will appear inside `<desc></desc>` tags, in the content of the SVG element.
   */
  svgDesc: string;

  /**
   * Sets a title for the visualization.
   * Will appear inside `<title></title>` tags, in the content of the SVG element.
   */
  svgTitle: string;

  /** Sets the threshold for buckets. */
  threshold: number;

  /**
   * Sets the accesor for the value of each datum, used in the threshold algorithm.
   * When evaluated must return a number.
   */
  thresholdKey: Accessor<T>;

  /** Sets the label for the shape bucket-reduced item in the visualization. */
  thresholdName: TypedAccessor<T, string>;

  /** Sets the accessor for the value of each datum which represents a temporal value. */
  time: Accessor<T>;

  /**
   * Filters the datums to show on the visualization, based on a temporal value.
   * This also determines the selection on the timeline, if enabled.
   */
  timeFilter: FilterFn<T>;

  /**
   * Activates or deactivates the timeline for the visualization.
   * This also requires setting the `time` accessor for the datums.
   */
  timeline: boolean;

  /** Sets the config for the timeline on the visualization, if activated. */
  timelineConfig: Partial<TimelineConfig<T>>;

  // timelinePadding([value])

  title: string;
  // titleConfig([value])
  // titlePadding([value])

  // tooltip([value])
  // tooltipConfig([value])
  // total([value])
  // totalConfig([value])
  // totalFormat(value)
  // totalPadding([value])
  // width([value])

  // zoom(value)
  // zoomBrushHandleSize(value)
  // zoomBrushHandleStyle(value)
  // zoomBrushSelectionStyle(value)
  // zoomControlStyle(value)
  // zoomControlStyleActive(value)
  // zoomControlStyleHover(value)
  // zoomFactor(value)
  // zoomMax(value)
  // zoomPan(value)
  // zoomPadding(value)
  // zoomScroll([value])
}
