import {Button} from "@blueprintjs/core";
import copy from "clipboard-copy";
import {createElement} from "react";

/** @type {React.FC<BlueprintCore.ButtonProps & {copyText: string}>} */
export const ButtonCopy = props => {
  const {copyText, ...buttonProps} = props;

  return createElement(Button, {
    ...buttonProps,
    onClick: evt => {
      evt.stopPropagation();
      copy(copyText);
    }
  });
};
