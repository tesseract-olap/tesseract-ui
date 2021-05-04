import classNames from "classnames";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SettingsProvider} from "../hooks/settings";
import {TranslationProvider} from "../hooks/translation";
import {doClientSetup} from "../middleware/actions";
import {updateLocaleList} from "../state/server/actions";
import {selectServerState} from "../state/server/selectors";
import {AnimatedCube} from "./AnimatedCube";
import {ExplorerParams} from "./ExplorerParams";
import {ExplorerQueries} from "./ExplorerQueries";
import {ExplorerResults} from "./ExplorerResults";
import {LoadingOverlay} from "./LoadingOverlay";
import ResultPivot from "./ResultPivot";
import ResultRaw from "./ResultRaw";
import ResultTable from "./ResultTable";

/** @type {Required<Pick<TessExpl.ExplorerProps, "locale" | "panels" | "transientIcon" | "uiLocale">>} */
const defaultProps = {
  locale: ["en"],
  panels: {
    "Data table": ResultTable,
    "Pivot table": ResultPivot,
    "Raw response": ResultRaw
  },
  transientIcon: <AnimatedCube />,
  uiLocale: "en"
};

/** @type {React.FC<TessExpl.ExplorerProps>} */
export const ExplorerComponent = props => {
  const dispatch = useDispatch();

  const serverState = useSelector(selectServerState);

  const [availableLocale] = useState(props.locale);

  useEffect(() => {
    dispatch(updateLocaleList(props.locale || defaultProps.locale));
    dispatch(doClientSetup(props.src));
  }, [availableLocale, props.src]);

  return (
    <SettingsProvider formatters={props.formatters}>
      <TranslationProvider defaultLocale={props.uiLocale} translations={props.translations}>
        <div className={classNames("explorer-wrapper", props.className)}>
          <LoadingOverlay className="explorer-loading" />
          {props.multiquery && serverState.online
            ? <ExplorerQueries className="explorer-queries" />
            : <div/>
          }
          {serverState.online
            ? <ExplorerParams className="explorer-params" />
            : <div/>
          }
          <ExplorerResults
            className="explorer-results"
            panels={props.panels || defaultProps.panels}
            transientIcon={props.transientIcon ?? defaultProps.transientIcon}
          />
        </div>
      </TranslationProvider>
    </SettingsProvider>
  );
};

ExplorerComponent.defaultProps = defaultProps;
