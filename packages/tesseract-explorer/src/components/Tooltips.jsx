import {Tooltip, Button, Icon} from "@blueprintjs/core";
import {createElement} from "react";

/**
 * @typedef TooltipProps
 * @property {string | JSX.Element} tooltipText
 * @property {import("@blueprintjs/core").Intent} [tooltipIntent]
 * @property {import("@blueprintjs/core").Position} [tooltipPosition]
 */

/** @type {React.FC<import("@blueprintjs/core").IIconProps & TooltipProps>} */
export const IconTooltip = props => {
  const {tooltipText, tooltipIntent, tooltipPosition, ...iconProps} = props;
  return createElement(Tooltip, {
    autoFocus: false,
    boundary: "viewport",
    className: "icon-tooltip",
    content: tooltipText,
    intent: tooltipIntent,
    position: tooltipPosition
  }, createElement(Icon, iconProps));
};

/** @type {React.FC<import("@blueprintjs/core").IButtonProps & TooltipProps>} */
export const ButtonTooltip = props => {
  const {tooltipText, tooltipIntent, tooltipPosition, ...buttonProps} = props;
  return createElement(Tooltip, {
    autoFocus: false,
    boundary: "viewport",
    className: "button-tooltip",
    content: tooltipText,
    intent: tooltipIntent,
    position: tooltipPosition
  }, createElement(Button, buttonProps));
};
