import {Alert, Group, Text} from "@mantine/core";
import React from "react";
import {useSelector} from "react-redux";
import {useSettings} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectIsPreviewMode} from "../state/queries";
import {PreviewModeSwitch} from "./PreviewModeSwitch";

/**
 * Renders a warning message to the user, about the limitations on the result
 * count for quick iteration purposes.
 */
export function PreviewModeMessage() {

  const {translate: t} = useTranslation();

  const isPreviewMode = useSelector(selectIsPreviewMode);

  const {previewLimit} = useSettings();

  if (!isPreviewMode) return null;

  return (
    <Alert color="yellow" id="alert-load-all-results" radius={0}>
      <Group position="apart">
        <Text>
          <Text fw={700} span>{t("previewMode.title_preview")}: </Text>
          <Text span>{t("previewMode.description_preview", {limit: previewLimit})}</Text>
        </Text>
        <PreviewModeSwitch noPopover={true} />
      </Group>
    </Alert>
  );
}
