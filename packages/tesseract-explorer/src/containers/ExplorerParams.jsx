import {ButtonGroup} from "@blueprintjs/core";
import React from "react";
import {ExplorerColumn} from "../components/ExplorerColumn";
import {useTranslation} from "../utils/useTranslation";
import ButtonExecuteQuery from "./ButtonExecuteQuery";
import {ConnectedDownloadOptions as DownloadOptions} from "./DownloadOptions";
import {ConnectedQueryBooleans as QueryBooleans} from "./QueryBooleans";
import QueryCuts from "./QueryCuts";
import QueryDrilldowns from "./QueryDrilldowns";
import QueryGrowth from "./QueryGrowth";
import QueryMeasures from "./QueryMeasures";
import QueryRca from "./QueryRca";
import QueryTopk from "./QueryTopk";
import {ConnectedSelectCube as SelectCube} from "./SelectCube";
import {ConnectedSelectLocale as SelectLocale} from "./SelectLocale";

/**
 * @typedef OwnProps
 * @property {string} className
 * @property {boolean} [enableGrowth]
 * @property {boolean} [enableRca]
 * @property {boolean} [enableTopk]
 */

/** @type {React.FC<OwnProps>} */
export const ExplorerParams = props => {
  const {translate: t} = useTranslation();

  return (
    <ExplorerColumn className={props.className} title={t("params.column_title")}>
      <ButtonGroup className="cube-locale" fill vertical>
        <SelectLocale />
        <SelectCube fill hideIfEmpty />
      </ButtonGroup>

      <QueryMeasures />
      <QueryDrilldowns />
      <QueryCuts />
      {props.enableGrowth && <QueryGrowth />}
      {props.enableRca && <QueryRca />}
      {props.enableTopk && <QueryTopk />}
      <QueryBooleans />

      <ButtonGroup className="query-actions" fill>
        <ButtonExecuteQuery />
      </ButtonGroup>

      <DownloadOptions />
    </ExplorerColumn>
  );
};
