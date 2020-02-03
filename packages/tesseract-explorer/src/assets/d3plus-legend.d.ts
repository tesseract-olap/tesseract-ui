interface ColorScaleConfig<T> {
  /**
   * The [ColorScale](http://d3plus.org/docs/#ColorScale) is constructed by combining an [Axis](http://d3plus.org/docs/#Axis) for the ticks/labels and a [Rect](http://d3plus.org/docs/#Rect) for the actual color box (or multiple boxes, as in a jenks scale).
   * Because of this, there are separate configs for the [Axis](http://d3plus.org/docs/#Axis) class used to display the text ([axisConfig](http://d3plus.org/docs/#ColorScale.axisConfig)) and the [Rect](http://d3plus.org/docs/#Rect) class used to draw the color breaks ([rectConfig](http://d3plus.org/docs/#ColorScale.rectConfig)).
   * This method acts as a pass-through to the config method of the [Axis](http://d3plus.org/docs/#Axis).
   * An example usage of this method can be seen [here](http://d3plus.org/examples/d3plus-legend/colorScale-dark/).
   */
  axisConfig: Partial<AxisConfig<T>>;

  /**
   * Sets the horizontal alignment.
   * Supports `"left"`, `"center"` and `"right"`.
   */
  align: "left" | "center" | "right";

  /**
   * The number of discrete buckets to create in a bucketed color scale.
   * Will be overridden by any custom Array of colors passed to the `color` method.
   */
  buckets: number;

  /**
   * Determines whether or not to use an Axis to display bucket scales (both "buckets" and "jenks").
   * When set to `false`, bucketed scales will use the `Legend` class to display squares for each range of data.
   * When set to `true`, bucketed scales will be displayed on an `Axis`, similar to "linear" scales.
   */
  bucketAxis: boolean;

  // color
  // colorMax
  // colorMid
  // colorMin
  // data
  // duration
  // height

  /** An object that describes how the legend will be rendered. */
  legendConfig: Partial<LegendConfig<T>>;

  // midpoint
  // orient
  // padding

  /**
   * The [ColorScale](http://d3plus.org/docs/#ColorScale) is constructed by combining an [Axis](http://d3plus.org/docs/#Axis) for the ticks/labels and a [Rect](http://d3plus.org/docs/#Rect) for the actual color box (or multiple boxes, as in a jenks scale).
   * Because of this, there are separate configs for the [Axis](http://d3plus.org/docs/#Axis) class used to display the text ([axisConfig](http://d3plus.org/docs/#ColorScale.axisConfig)) and the [Rect](http://d3plus.org/docs/#Rect) class used to draw the color breaks ([rectConfig](http://d3plus.org/docs/#ColorScale.rectConfig)).
   * This method acts as a pass-through to the config method of the [Rect](http://d3plus.org/docs/#Rect).
   * An example usage of this method can be seen [here](http://d3plus.org/examples/d3plus-legend/colorScale-dark/).
   */
  rectConfig: Partial<ShapeConfig<T>>;

  /**
   * Sets the scale of the ColorScale.
   * Allowed values are `"linear"`, `"jenks"`, or `"buckets"`.
   */
  scale: "buckets" | "jenks" | "linear";

  // select

  /**
   * The height of horizontal color scales, and width when positioned vertical.
   */
  size: number;

  /**
   * Sets the accesor to the value on each datapoint.
   */
  value: Accessor<T>;

  /**
   * Sets the overall width of the ColorScale.
   */
  width: number;
}

interface LegendConfig<T> {
  // active([value])
  // align([value])
  // data([data])
  // direction([value])
  // duration([value])
  // height([value])
  // hover([value])
  // id([value])
  // label([value])
  // padding([value])
  // select([selector])
  // shape([value])
  // shapeConfig([config])
  // title([value])
  titleConfig: Partial<TextBoxConfig<T>>;
  // verticalAlign([value])
  // width([value])
}
