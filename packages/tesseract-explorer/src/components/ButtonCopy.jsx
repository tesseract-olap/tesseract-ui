import React from "react";
import {Button} from "@blueprintjs/core";
import copy from "clipboard-copy";

/**
 * @typedef {import("@blueprintjs/core").IButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>} ButtonProps
 */

/** @type {React.FC<ButtonProps & {copyText: string}>} */
const ButtonCopy = ({copyText, ...props}) =>
  <Button {...props} onClick={evt => {
    evt.stopPropagation(); copy(copyText);
  }} />;

export default ButtonCopy;
