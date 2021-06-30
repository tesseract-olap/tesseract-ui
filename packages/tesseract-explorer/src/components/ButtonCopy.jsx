import {Button} from "@blueprintjs/core";
import copy from "clipboard-copy";
import React, {useCallback} from "react";

/** @type {React.FC<BlueprintCore.ButtonProps & {copyText: string}>} */
export const ButtonCopy = props => {
  const {copyText, ...buttonProps} = props;

  const onClick = useCallback(evt => {
    evt.stopPropagation();
    copy(copyText);
  }, [copyText]);

  return <Button {...buttonProps} onClick={onClick} />;
};
