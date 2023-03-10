import {Button} from "@mantine/core";
import copy from "clipboard-copy";
import React, {useCallback} from "react";

/**
 * @typedef OwnProps
 * @property {string} children
 * @property {string} copyText
 * @property {React.ReactNode} leftIcon
 */

/** @type {React.FC<OwnProps>} */
export const ButtonCopy = props => {
  const {copyText, ...buttonProps} = props;

  const onClick = useCallback(evt => {
    evt.stopPropagation();
    copy(copyText);
  }, [copyText]);

  return <Button
    {...buttonProps} 
    component="a" 
    onClick={onClick}
    sx={theme => ({
      "&:hover": {
        color: theme.white,
        textDecoration: "none"
      }
    })}
  >
    {props.children}
  </Button>;
};
