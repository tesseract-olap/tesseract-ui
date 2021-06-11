import {AnchorButton, ButtonGroup, InputGroup, Intent} from "@blueprintjs/core";
import React from "react";
import {useTranslation} from "../hooks/translation";
import {ButtonCopy} from "./ButtonCopy";

export const DebugURL = props => {
  const {url} = props;

  const {translate: t} = useTranslation();

  const toolbar =
    <ButtonGroup>
      <AnchorButton href={url} icon="share" target="_blank" text={t("action_open")} />
      <ButtonCopy copyText={url} icon="link" intent={Intent.PRIMARY} text={t("action_copy")} />
    </ButtonGroup>;

  return (
    <InputGroup leftIcon="globe" readOnly={true} rightElement={toolbar} value={url} />
  );
};
