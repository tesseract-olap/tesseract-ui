interface TextBoxConfig<T> {
  /**
   * Sets the "aria-hidden" attribute of the containing SVG element.
   * The default value is "false", but if you need to hide the SVG from screen readers set this property to "true".
   */
  ariaHidden: boolean;

  // data ([data]) ↩︎
  // delay ([value]) ↩︎
  // duration ([value]) ↩︎
  // ellipsis ([value]) ↩︎

  // fontColor ([value]) ↩︎
  // fontFamily ([value]) ↩︎
  // fontMax ([value]) ↩︎
  // fontMin ([value]) ↩︎
  // fontOpacity ([value]) ↩︎
  // fontResize ([value]) ↩︎
  // fontSize ([value]) ↩︎
  // fontWeight ([value]) ↩︎

  /** Sets the height for each box. Must return a number. */
  height: TypedAccessor<T, number>;

  /**
   * Configures the ability to render simple HTML tags.
   * Defaults to supporting <b>, <strong>, <i>, and <em>, set to false to disable or provide a mapping of tags to svg styles
   */
  html: false | Record<"b" | "strong" | "i" | "em", string>;

  // id ([value]) ↩︎
  // lineHeight ([value]) ↩︎
  // maxLines ([value]) ↩︎
  // overflow ([value]) ↩︎
  // padding ([value]) ↩︎
  // pointerEvents ([value]) ↩︎
  // rotate ([value]) ↩︎
  // rotateAnchor (_) ↩︎
  // select ([selector]) ↩︎
  // split ([value]) ↩︎
  // text ([value]) ↩︎
  // textAnchor ([value]) ↩︎

  /**
   * Sets the vertical alignment.
   * Accepted values are `"top"`, `"middle"`, and `"bottom"`.
   */
  verticalAlign: TypedAccessor<T, "top" | "middle" | "bottom">;

  /** Sets the height for each box. Must return a number. */
  width: TypedAccessor<T, number>;

  /**
   * Sets the x position for each box.
   * The number given should correspond to the left side of the textBox.
   */
  x: TypedAccessor<T, number>;

  /**
   * Sets the y position for each box.
   * The number given should correspond to the left side of the textBox.
   */
  y: TypedAccessor<T, number>;
}
