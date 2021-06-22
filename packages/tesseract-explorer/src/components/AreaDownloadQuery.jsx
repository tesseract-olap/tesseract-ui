import {ButtonGroup} from "@blueprintjs/core";
import React, {useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {willDownloadQuery} from "../middleware/olapActions";
import {doSetLoadingState} from "../state/loading/actions";
import {selectCurrentQueryItem} from "../state/queries/selectors";
import {selectServerFormatsEnabled} from "../state/server/selectors";
import {ButtonDownload} from "./ButtonDownload";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
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
      text={t(`formats.${format}`)}
    />
  ), [formats]);

  if (queryItem.isDirty || buttons.length === 0) {
    return null;
  }

  return (
    <div className="download-area p-3">
      <h4 className="mt-0 mb-3">{t("params.title_downloaddata")}</h4>
      <ButtonGroup fill>{buttons}</ButtonGroup>
    </div>
  );
};
