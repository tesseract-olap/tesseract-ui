declare namespace d3plus {
  namespace react {
    interface AxisConfig {
      title: string;
      tickFormat: format.NumberFormatter;
    }

    interface ChartConfig<T> extends viz.VizConfig<T> { }

    interface BarChartConfig<T> extends ChartConfig<T> {
      /** Sets the accessor to the values used in the x-axis. */
      x: common.Accessor<T>;

      /** Sets the config method for the x-axis. */
      xConfig: Partial<AxisConfig>;

      /** Sets the accessor to the values used in the secondary x-axis. */
      x2: common.Accessor<T>;

      /** Sets the config method for the secondary x-axis. */
      x2Config: Partial<AxisConfig>;

      /** Sets the accessor to the values used in the y-axis. */
      y: common.Accessor<T>;

      /** Sets the config method for the y-axis. */
      yConfig: Partial<AxisConfig>;

      /** Sets the accessor to the values used in the secondary y-axis. */
      y2: common.Accessor<T>;

      /** Sets the config method for the secondary y-axis. */
      y2Config: Partial<AxisConfig>;
    }

    interface TreemapConfig<T> extends ChartConfig<T> {
      /** Sets the inner and outer padding. */
      layoutPadding: TypedAccessor<T, number>;

      /** Sets the sort order for the treemap using the specified comparator function. */
      sort: SorterFn<T>[];

      /** Sets the accessor to the value in each datum object, which will be reduced into a sum for non-categorized objects. */
      sum: common.Accessor<T>;

      /**
       * Sets the [tiling method](https://github.com/d3/d3-hierarchy#treemap-tiling) for the treemap.
       * The tiling method in a treemap is the algorithm used to distribute the area of the squares in a certain proportion of height and width.
       * By default, d3plus uses [`d3.treemapSquarify`](https://github.com/d3/d3-hierarchy#treemapSquarify), using the golden ratio as aspect.
       */
      tile: hierarchy.TreemapTilingFn;
    }

  }
}
