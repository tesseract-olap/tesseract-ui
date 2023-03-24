import {Alert, Group, Text} from "@mantine/core";
import React from "react";
import {useSelector} from "react-redux";
import {useSettings} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectIsFullResults} from "../state/params/selectors";
import {LoadAllResultsSwitch} from "./LoadAllResultsSwitch";


/** @type {React.FC<{}>} */
export const LoadAllResultsMessage = () => {

  const {translate: t} = useTranslation();

  const isFullResults = useSelector(selectIsFullResults);

  const {previewLimit} = useSettings();

  if (isFullResults) return <></>;

  return (
    <Alert color="yellow" id="alert-load-all-results" radius={0}>
      <Group position="apart">
        <Text>
          <Text fw={700} span>{t("previewMode.title_preview")}: </Text>
          <Text span>{t("previewMode.description_preview", {limit: previewLimit})}</Text>
        </Text>
        <LoadAllResultsSwitch noPopover={true} />
      </Group>
    </Alert>
  );
};
