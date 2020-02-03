import React from "react";
import { Classes } from "@blueprintjs/core";

/**
 * @typedef OwnProps
 * @property {string} icon
 */

/** @type {React.FC<OwnProps>} */
const Icon = function(props) {
  const {
    className,
    color,
    htmlTitle,
    iconSize = Icon.SIZE_STANDARD,
    intent,
    title = icon,
    tagName = "span",
    ...htmlprops
  } = this.props;

  // choose which pixel grid is most appropriate for given icon size
  const pixelGridSize =
    iconSize >= Icon.SIZE_LARGE ? Icon.SIZE_LARGE : Icon.SIZE_STANDARD;
  // render path elements, or nothing if icon name is unknown.
  const paths = this.renderSvgPaths(pixelGridSize, icon);

  const classes = classNames(
    Classes.ICON,
    Classes.iconClass(icon),
    Classes.intentClass(intent),
    className
  );
  const viewBox = `0 0 ${pixelGridSize} ${pixelGridSize}`;

  return React.createElement(
    tagName,
    {
      ...htmlprops,
      className: classes,
      title: htmlTitle
    },
    <svg
      fill={color}
      data-icon={icon}
      width={iconSize}
      height={iconSize}
      viewBox={viewBox}
    >
      {title && <desc>{title}</desc>}
      {paths}
    </svg>
  );
};

// @ts-ignore
Icon.SIZE_STANDARD = 16;
// @ts-ignore
Icon.SIZE_LARGE = 20;

export default Icon;
