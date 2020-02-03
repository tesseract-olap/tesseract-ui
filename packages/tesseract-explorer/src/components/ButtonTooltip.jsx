import {Tooltip, Button} from "@blueprintjs/core";
import React from "react";

/**
 * @typedef {import("@blueprintjs/core").IButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>} ButtonProps
 */

/**
 * @typedef OwnProps
 * @property {string | JSX.Element | undefined} tooltip
 * @property {import("@blueprintjs/core").Intent} [intent]
 * @property {import("@blueprintjs/core").Position} [position]
 */

/** @type {React.FC<ButtonProps & OwnProps>} */
const ButtonTooltip = ({tooltip, intent, position, ...buttonProps}) =>
  <Tooltip autoFocus={false} content={tooltip} intent={intent} position={position}>
    <Button {...buttonProps} />
  </Tooltip>;

export default ButtonTooltip;
