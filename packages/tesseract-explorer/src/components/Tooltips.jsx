import {Tooltip, Button, Icon} from "@blueprintjs/core";
import {createElement} from "react";

/**
 * @typedef TooltipProps
 * @property {string | JSX.Element} tooltipText
 * @property {string} [tooltipClassName]
 * @property {BlueprintCore.Intent} [tooltipIntent]
 * @property {BlueprintCore.Position} [tooltipPosition]
 */

/** @type {React.FC<TooltipProps>} */
export const TooltipWrapper = props => createElement(Tooltip, {
  autoFocus: false,
  boundary: "viewport",
  className: props.tooltipClassName,
  content: props.tooltipText,
  intent: props.tooltipIntent,
  position: props.tooltipPosition
}, props.children);

/** @type {React.FC<BlueprintCore.IconProps & TooltipProps>} */
export const IconTooltip = props => {
  const {tooltipIntent, tooltipPosition, tooltipText, ...restProps} = props;
  return createElement(TooltipWrapper, {
    tooltipClassName: "icon-tooltip",
    tooltipIntent,
    tooltipPosition,
    tooltipText
  }, createElement(Icon, restProps));
};

/** @type {React.FC<BlueprintCore.ButtonProps & TooltipProps>} */
export const ButtonTooltip = props => {
  const {tooltipIntent, tooltipPosition, tooltipText, ...restProps} = props;
  return createElement(TooltipWrapper, {
    tooltipClassName: "button-tooltip",
    tooltipIntent,
    tooltipPosition,
    tooltipText
  }, createElement(Button, restProps));
};
