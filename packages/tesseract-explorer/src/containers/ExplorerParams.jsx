import {ButtonGroup} from "@blueprintjs/core";
import React from "react";
import {ExplorerColumn} from "../components/ExplorerColumn";
import {useTranslation} from "../hooks/translation";
import {ConnectedButtonExecuteQuery as ButtonExecuteQuery} from "./ButtonExecuteQuery";
import {ConnectedDownloadOptions as DownloadOptions} from "./DownloadOptions";
import {ConnectedQueryBooleans as QueryBooleans} from "./QueryBooleans";
import QueryCuts from "./QueryCuts";
import QueryDrilldowns from "./QueryDrilldowns";
import QueryMeasures from "./QueryMeasures";
import {ConnectedSelectCube as SelectCube} from "./SelectCube";
import {ConnectedSelectLocale as SelectLocale} from "./SelectLocale";

/**
 * @typedef OwnProps
 * @property {string} className
 */

/** @type {React.FC<OwnProps>} */
export const ExplorerParams = props => {
  const {translate: t} = useTranslation();

  return (
    <ExplorerColumn className={props.className} title={t("params.column_title")}>
      <ButtonGroup className="cube-locale p-3" fill vertical>
        <SelectLocale />
        <SelectCube />
      </ButtonGroup>

      <QueryMeasures />
      <QueryDrilldowns />
      <QueryCuts />
      <QueryBooleans />

      <div className="actions">
        <ButtonExecuteQuery />
        <DownloadOptions />
      </div>
    </ExplorerColumn>
  );
};
