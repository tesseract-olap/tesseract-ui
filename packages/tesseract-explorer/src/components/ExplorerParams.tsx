import {Accordion} from "@mantine/core";
import React from "react";
import {useTranslation} from "../hooks/translation";
import {AreaCuts} from "./AreaCuts";
import {AreaDownloadQuery} from "./AreaDownloadQuery";
import {AreaDrilldowns} from "./AreaDrilldowns";
import {AreaMeasures} from "./AreaMeasures";
import {AreaOptions} from "./AreaOptions";
import {ButtonExecuteQuery} from "./ButtonExecuteQuery";
import {CollapsiblePanel} from "./Layout/CollapsiblePanel";
import {PreviewModeSwitch} from "./PreviewModeSwitch";
import {SelectCube} from "./SelectCube";
import {SelectLocale} from "./SelectLocale";

export const ExplorerParams = (props: {

  /** Defines which panel will be opened by default on the first load. */
  defaultOpen: string;
}) => {
  const {translate: t} = useTranslation();

  return (
    <CollapsiblePanel id="layout-column-explorer-params" title={t("params.column_title")}>
      <SelectLocale />
      <SelectCube />

      <Accordion
        chevronPosition="left"
        defaultValue={props.defaultOpen}
        styles={theme => ({
          chevron: {
            marginRight: `calc(${theme.spacing.xs} / 2)`
          }
        })}
        variant="contained"
      >
        <AreaMeasures />
        <AreaDrilldowns />
        <AreaCuts />
        <AreaOptions />
      </Accordion>

      <div id="switch-params-load-all-results">
        <PreviewModeSwitch withTooltip />
      </div>
      <ButtonExecuteQuery />
      <AreaDownloadQuery />
    </CollapsiblePanel>
  );
};
