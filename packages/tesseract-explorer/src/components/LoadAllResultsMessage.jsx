import {Callout} from "@blueprintjs/core";
import React from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {useSettings} from "../hooks/settings";
import {selectBooleans} from "../state/params/selectors";
import {LoadAllResultsSwitch} from "./LoadAllResultsSwitch";

/**
 * @typedef LoadAllResultsMessageProps
 */

/** @type {React.FC<LoadAllResultsMessage>} */
export const LoadAllResultsMessage = () => {

  const {translate: t} = useTranslation();

  const {full_results} = useSelector(selectBooleans);

  const {previewLimit} = useSettings();

  return (
    <Callout>
      <p>
        <strong>{full_results ? t("previewMode.title_full") : t("previewMode.title_preview")}:</strong>
        {" "}
        {full_results ? t("previewMode.description_full") : t("previewMode.description_preview", {limit: previewLimit})}
        {" "}
      </p>
      <LoadAllResultsSwitch noPopover={true} />
    </Callout>
  );
};
