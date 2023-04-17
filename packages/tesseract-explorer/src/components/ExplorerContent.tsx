import {ServerConfig} from "@datawheel/olap-client";
import {TranslationContextProps} from "@datawheel/use-translation";
import {Flex} from "@mantine/core";
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {useSetup} from "../hooks/setup";
import {useTranslation} from "../hooks/translation";
import {selectServerState} from "../state/server";
import {AnimatedCube} from "./AnimatedCube";
import {ExplorerParams} from "./ExplorerParams";
import {ExplorerQueries} from "./ExplorerQueries";
import {ExplorerResults, PanelDescriptor} from "./ExplorerResults";
import {LoadingOverlay} from "./LoadingOverlay";
import {NonIdealState} from "./NonIdealState";

/** */
export function ExplorerContent(props: {
  dataLocale: string[];
  panels: PanelDescriptor[];
  previewLimit: number;
  source: ServerConfig;
  splash?: React.ComponentType<{translation: TranslationContextProps}>;
  withMultiQuery: boolean;
}) {
  const translation = useTranslation();

  const isSetupDone = useSetup(props.source, props.dataLocale, props.previewLimit);

  const serverState = useSelector(selectServerState);

  const splash = useMemo(() => {
    const SplashComponent = props.splash;
    return SplashComponent
      ? <SplashComponent translation={translation} />
      : <NonIdealState icon={<AnimatedCube />} />;
  }, [props.splash]);

  return (
    <Flex
      h="100vh"
      w="100%"
      gap={0}
      sx={theme => ({
        [theme.fn.smallerThan("md")]: {
          flexDirection: "column",
          height: "100%"
        }
      })}
    >
      <LoadingOverlay />
      {isSetupDone && serverState.online && props.withMultiQuery
        ? <ExplorerQueries />
        : <div/>
      }
      {isSetupDone && serverState.online
        ? <ExplorerParams />
        : <div/>
      }
      <ExplorerResults
        panels={props.panels}
        splash={splash}
      />
    </Flex>
  );
}
