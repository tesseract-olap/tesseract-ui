import {Flex, MantineProvider} from "@mantine/core";
import React from "react";
import {useSelector} from "react-redux";
import {SettingsProvider} from "../hooks/settings";
import {useSetup} from "../hooks/setup";
import {TranslationProvider} from "../hooks/translation";
import {selectServerState} from "../state/server/selectors";
import {AnimatedCube} from "./AnimatedCube";
import {ExplorerParams} from "./ExplorerParams";
import {ExplorerQueries} from "./ExplorerQueries";
import {ExplorerResults} from "./ExplorerResults";
import {LoadingOverlay} from "./LoadingOverlay";
import {PivotView} from "./PivotView";
import ResultRaw from "./ResultRaw";
import {TableView} from "./TableView";

/** @type {Required<Pick<TessExpl.ExplorerProps, "locale" | "panels" | "transientIcon" | "uiLocale" | "withinMantineProvider">> & {version: string}} */
const defaultProps = {
  locale: ["en"],
  panels: {
    "Data table": TableView,
    "Pivot table": PivotView,
    "Raw response": ResultRaw
  },
  transientIcon: <AnimatedCube />,
  uiLocale: "en",
  version: process.env.buildVersion || "dev",
  withinMantineProvider: true,
};

/** @type {React.FC<TessExpl.ExplorerProps>} */
export const ExplorerComponent = props => {

  const previewLimit = props.previewLimit || 50;

  const isSetupDone = useSetup(props.src, props.locale || defaultProps.locale, previewLimit);

  const serverState = useSelector(selectServerState);

  const explorer = (
    <SettingsProvider formatters={props.formatters} previewLimit={previewLimit}>
      <TranslationProvider defaultLocale={props.uiLocale} translations={props.translations}>
        <Flex
          h="100vh"
          w="100%"
          gap={0}
          sx={(theme) => ({
            [theme.fn.smallerThan("md")]: {
              flexDirection: "column",
              height: "100%"
            }
          })}
        >
          <LoadingOverlay />
          {isSetupDone && serverState.online && props.multiquery
            ? <ExplorerQueries />
            : <div/>
          }
          {isSetupDone && serverState.online
            ? <ExplorerParams />
            : <div/>
          }
          <ExplorerResults
            panels={props.panels || defaultProps.panels}
            DefaultSplash={props.DefaultSplash}
            transientIcon={props.transientIcon ?? defaultProps.transientIcon}
          />
        </Flex>
      </TranslationProvider>
    </SettingsProvider>
  );

  return props.withinMantineProvider
    ? <MantineProvider withNormalizeCSS>{explorer}</MantineProvider>
    : explorer
};

ExplorerComponent.defaultProps = defaultProps;
ExplorerComponent.displayName = "TesseractExplorer";
