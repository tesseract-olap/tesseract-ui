interface TimelineConfig<T> {
  /** Sets the button padding. */
  buttonPadding: number;

  /** Enables or disables brushing over multiple temporal points at once in the timeline. */
  brushing: boolean;

  /** Filters which of the events triggered on the timeline are going to execute some response. */
  brushFilter: TypedAccessor<T, boolean>;

  /**
   * Sets the horizontal alignment of the button timeline.
   * Accepted values are `"start"`, `"middle"` and `"end"`.
   */
  buttonAlign: "start" | "middle" | "end";

  /**
   * Sets the style of the timeline.
   * Accepted values are `"auto"`, `"buttons"` and `"ticks"`.
   */
  buttonBehavior: "auto" | "buttons" | "ticks";

  /** Sets the button height. */
  buttonHeight: number;

  /** Sets the handle style. */
  handleConfig: Partial<ShapeConfig<T>>;

  /** Sets the handle size. */
  handleSize: number;

  /**
   * For each brush event specified on the keys of the objects, sets a listener function given by its value.
   * Mirrors the core [d3-brush](https://github.com/d3/d3-brush#brush_on) behavior.
   */
  on: Record<string, TypedAccessorFn<T, void>>;

  /**
   * Sets the selection style.
   * TODO: elaborate
   */
  selectionConfig;

  /**
   * Sets the selection.
   * Defaults to the most recent year in the timeline.
   * TODO: elaborate
   */
  selection;

  /**
   * Toggles snapping on the values of the timeline.
   * This means the handles will move smoothly, or will snap between values.
   * Default value is `true`.
   */
  snapping: boolean;
}
