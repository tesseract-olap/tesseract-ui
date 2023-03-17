import {Accordion, Divider, Space} from "@mantine/core";
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

export const ExplorerParams = () => {
  const {translate: t} = useTranslation();

  return (
    <LayoutColumn title={t("params.column_title")}>
      <SelectLocale />
      <SelectCube />
      <Space h="md" />
      <Accordion 
        chevronPosition="left"
        defaultValue="measures" 
        styles={theme => ({
          chevron: {
            marginRight: theme.spacing.xs / 2
          }
        })}
        variant="contained"
      >
        <AreaMeasures />
        <AreaDrilldowns />
        <AreaCuts />
        <AreaOptions />
      </Accordion>
      <Space h="md" />
      <ButtonExecuteQuery />
      <Divider my="md" />
      <AreaDownloadQuery />
    </LayoutColumn>
  );
};
