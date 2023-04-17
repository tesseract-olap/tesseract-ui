import {Button, Group, Input} from "@mantine/core";
import {IconClipboard, IconExternalLink, IconWorld} from "@tabler/icons-react";
import React from "react";
import {useTranslation} from "../hooks/translation";
import {ButtonCopy} from "./ButtonCopy";

export const DebugURL = props => {
  const {url} = props;

  const {translate: t} = useTranslation();

  const toolbar =
    <Button.Group>
      <Button component="a" href={url} leftIcon={<IconExternalLink />} target="_blank" variant="default">
        {t("action_open")}  
      </Button>
      <ButtonCopy copyText={url} leftIcon={<IconClipboard />}>
        {t("action_copy")}
      </ButtonCopy>
    </Button.Group>;

  return (
    <Group noWrap spacing="xs">
      <Input
        icon={<IconWorld />} 
        readOnly
        rightSectionWidth="auto"
        value={url} 
        w="100%"
      />
      {toolbar}
    </Group>
  );
};
