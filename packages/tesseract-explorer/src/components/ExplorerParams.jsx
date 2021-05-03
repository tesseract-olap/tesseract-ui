import {ButtonGroup} from "@blueprintjs/core";
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
      <ButtonGroup className="cube-locale p-3" fill vertical>
        <SelectLocale />
        <SelectCube />
      </ButtonGroup>

      <AreaMeasures />
      <AreaDrilldowns />
      <AreaCuts />
      <AreaOptions />

      <ButtonExecuteQuery />
      <AreaDownloadQuery />
    </LayoutColumn>
  );
};
