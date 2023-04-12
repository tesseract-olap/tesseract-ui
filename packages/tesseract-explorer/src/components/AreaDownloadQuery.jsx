import {Box, Button, Divider, Input} from "@mantine/core";
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {useActions} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectCurrentQueryItem} from "../state/queries";
import {selectServerFormatsEnabled} from "../state/server";
import {ButtonDownload} from "./ButtonDownload";

export const AreaDownloadQuery = () => {
  const actions = useActions();

  const {translate: t} = useTranslation();

  const queryItem = useSelector(selectCurrentQueryItem);
  const formats = useSelector(selectServerFormatsEnabled);

  const buttons = useMemo(() => formats.map(format =>
    <ButtonDownload
      key={format}
      provider={() => {
        actions.setLoadingState("FETCHING");
        return actions.willDownloadQuery(format)
          .then(fileDescr => {
            actions.setLoadingState("SUCCESS");
            return fileDescr;
          }, error => {
            actions.setLoadingState("FAILURE", error.message);
            throw error;
          });
      }}
    >
      {t(`formats.${format}`)}
    </ButtonDownload>
  ), [formats]);

  if (queryItem.isDirty || buttons.length === 0) {
    return null;
  }

  return (
    <Box id="button-group-download-results">
      <Divider my="md" />
      <Input.Wrapper label={t("params.title_downloaddata")}>
        <Button.Group>{buttons}</Button.Group>
      </Input.Wrapper>
    </Box>
  );
};
