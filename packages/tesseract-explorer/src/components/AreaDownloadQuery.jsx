import {Box, Button, Divider, Input} from "@mantine/core";
import React, {useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {willDownloadQuery} from "../middleware/olapActions";
import {doSetLoadingState} from "../state/loading/actions";
import {selectCurrentQueryItem} from "../state/queries/selectors";
import {selectServerFormatsEnabled} from "../state/server/selectors";
import {ButtonDownload} from "./ButtonDownload";

export const AreaDownloadQuery = () => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const queryItem = useSelector(selectCurrentQueryItem);
  const formats = useSelector(selectServerFormatsEnabled);

  const buttons = useMemo(() => formats.map(format =>
    <ButtonDownload
      key={format}
      provider={() => {
        dispatch(doSetLoadingState("REQUEST"));
        return dispatch(willDownloadQuery(format))
          .then(fileDescr => {
            dispatch(doSetLoadingState("SUCCESS"));
            return fileDescr;
          }, error => {
            dispatch(doSetLoadingState("FAILURE", error.message));
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
