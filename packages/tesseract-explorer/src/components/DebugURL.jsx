import {AnchorButton, ButtonGroup, InputGroup, Intent} from "@blueprintjs/core";
import React from "react";
import ButtonCopy from "./ButtonCopy";

export const DebugURL = ({url, labelOpen = "Open", labelCopy = "Copy"}) => {
  const toolbar =
    <ButtonGroup>
      <AnchorButton href={url} icon="share" target="_blank" text={labelOpen} />
      <ButtonCopy copyText={url} icon="link" intent={Intent.PRIMARY} text={labelCopy} />
    </ButtonGroup>;

  return (
    <InputGroup leftIcon="globe" readOnly={true} rightElement={toolbar} value={url} />
  );
};
