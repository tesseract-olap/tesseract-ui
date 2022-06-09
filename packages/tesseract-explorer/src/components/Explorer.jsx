import clsx from "classnames";
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

/** @type {Required<Pick<TessExpl.ExplorerProps, "locale" | "panels" | "transientIcon" | "uiLocale">> & {version: string}} */
const defaultProps = {
  locale: ["en"],
  panels: {
    "Data table": TableView,
    "Pivot table": PivotView,
    "Raw response": ResultRaw
  },
  transientIcon: <AnimatedCube />,
  uiLocale: "en",
  version: __buildVersion
};

/** @type {React.FC<TessExpl.ExplorerProps>} */
export const ExplorerComponent = props => {

  const previewLimit = props.previewLimit || 50;

  const isSetupDone = useSetup(props.src, props.locale || defaultProps.locale, previewLimit);

  const serverState = useSelector(selectServerState);

  return (
    <SettingsProvider formatters={props.formatters} previewLimit={previewLimit}>
      <TranslationProvider defaultLocale={props.uiLocale} translations={props.translations}>
        <div className={clsx("explorer-wrapper", props.className)}>
          <LoadingOverlay className="explorer-loading" />
          {isSetupDone && serverState.online && props.multiquery
            ? <ExplorerQueries className="explorer-queries" />
            : <div/>
          }
          {isSetupDone && serverState.online
            ? <ExplorerParams className="explorer-params" />
            : <div/>
          }
          <ExplorerResults
            className="explorer-results"
            panels={props.panels || defaultProps.panels}
            DefaultSplash={props.DefaultSplash}
            transientIcon={props.transientIcon ?? defaultProps.transientIcon}
          />
        </div>
      </TranslationProvider>
    </SettingsProvider>
  );
};

ExplorerComponent.defaultProps = defaultProps;
ExplorerComponent.displayName = "TesseractExplorer";
