import React from "react";
import {useTranslation} from "../hooks/translation";
import {AreaCuts} from "./AreaCuts";
import {AreaDownloadQuery} from "./AreaDownloadQuery";
import {AreaDrilldowns} from "./AreaDrilldowns";
import {AreaMeasures} from "./AreaMeasures";
import {AreaOptions} from "./AreaOptions";
import {ButtonExecuteQuery} from "./ButtonExecuteQuery";
import {LayoutColumn} from "./LayoutColumn";
import {SelectCube} from "./SelectCube";
import {SelectLocale} from "./SelectLocale";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
export const ExplorerParams = props => {
  const {translate: t} = useTranslation();

  return (
    <LayoutColumn className={props.className} title={t("params.column_title")}>
      <SelectLocale />
      <SelectCube />

      <AreaMeasures />
      <AreaDrilldowns />
      <AreaCuts />
      <AreaOptions />

      <ButtonExecuteQuery />
      <AreaDownloadQuery />
    </LayoutColumn>
  );
};
