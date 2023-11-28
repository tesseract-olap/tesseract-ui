import {ServerConfig} from "@datawheel/olap-client";
import {TranslationContextProps} from "@datawheel/use-translation";
import {CSSObject, Center, createStyles} from "@mantine/core";
import React, {useEffect, useMemo} from "react";
import {useSelector} from "react-redux";
import {useSetup} from "../hooks/setup";
import {useTranslation} from "../hooks/translation";
import {selectServerState} from "../state/server";
import {AnimatedCube} from "./AnimatedCube";
import {ExplorerParams} from "./ExplorerParams";
import {ExplorerQueries} from "./ExplorerQueries";
import {ExplorerResults, PanelDescriptor} from "./ExplorerResults";
import {LoadingOverlay} from "./LoadingOverlay";

const useStyles = createStyles((theme, params: {height: CSSObject["height"]}) => ({
  root: {
    display: "flex",
    flexFlow: "column nowrap",
    height: "100%",

    [theme.fn.largerThan("md")]: {
      flexDirection: "row",
      height: params.height,
      width: "100%"
    }
  },

  flexCol: {
    flex: "1 1 auto",

    [theme.fn.largerThan("md")]: {
      width: 0
    }
  }
}));

/** */
export function ExplorerContent(props: {
  dataLocale: string[];
  defaultOpenParams: string;
  height: CSSObject["height"];
  panels: PanelDescriptor[];
  source: ServerConfig;
  splash?: React.ComponentType<{translation: TranslationContextProps}>;
  uiLocale: string | undefined;
  withMultiQuery: boolean;
}) {
  const translation = useTranslation();

  const isSetupDone = useSetup(props.source, props.dataLocale);

  const serverState = useSelector(selectServerState);

  const {classes} = useStyles({height: props.height});

  // Monitor the uiLocale param to update the UI on change
  useEffect(() => {
    if (props.uiLocale) translation.setLocale(props.uiLocale);
  }, [props.uiLocale]);

  const splash = useMemo(() => {
    const SplashComponent = props.splash;
    return SplashComponent
      ? <SplashComponent translation={translation} />
      : <Center h="100%" sx={{flex: 1}}><AnimatedCube /></Center>;
  }, [props.splash]);

  return (
    <div className={classes.root}>
      <LoadingOverlay />
      {isSetupDone && serverState.online && props.withMultiQuery
        ? <ExplorerQueries />
        : null
      }
      {isSetupDone && serverState.online
        ? <ExplorerParams defaultOpen={props.defaultOpenParams} />
        : null
      }
      <ExplorerResults
        className={classes.flexCol}
        panels={props.panels}
        splash={splash}
      />
    </div>
  );
}
