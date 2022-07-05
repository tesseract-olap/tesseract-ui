import {Callout} from "@blueprintjs/core";
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
    <Callout className="load-all-results-msg-callout">
      <p>
        <strong>{t("previewMode.title_preview")}:</strong>
        {" "}
        {t("previewMode.description_preview", {limit: previewLimit})}
        {" "}
      </p>
      <LoadAllResultsSwitch noPopover={true} />
    </Callout>
  );
};
