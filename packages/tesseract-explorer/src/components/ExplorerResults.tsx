import {PlainCube} from "@datawheel/olap-client";
import {Anchor, Box, Flex, Stack, Tabs, Text, Title} from "@mantine/core";
import {IconAlertTriangle, IconBox, IconWorld} from "@tabler/icons-react";
import React, {Suspense, useState} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {selectCurrentQueryItem} from "../state/queries";
import {selectOlapCube} from "../state/selectors";
import {selectServerState} from "../state/server";
import {QueryParams, QueryResult} from "../utils/structs";
import {NonIdealState} from "./NonIdealState";
import {PreviewModeMessage} from "./PreviewModeMessage";

export interface ViewProps {
  className?: string;
  cube: PlainCube;
  params: QueryParams;
  result: QueryResult;
}

export interface PanelDescriptor {
  key: string;
  label: string;
  component: React.ComponentType<ViewProps>;
}

/**
 * Renders the result area in the UI.
 * Handles the currently active tab and its contents.
 */
export function ExplorerResults(props: {
  splash: React.ReactElement | null;
  panels: PanelDescriptor[];
}) {
  const {panels} = props;
  // TODO: move this state to QueryItem, set via actions
  const [currentTab, setCurrentTab] = useState(0);

  const serverStatus = useSelector(selectServerState);
  const cube = useSelector(selectOlapCube);
  const queryItem = useSelector(selectCurrentQueryItem);

  const {online: isServerOnline, url: serverUrl} = serverStatus;
  const {params, result} = queryItem;
  const {data, error} = result;

  const {translate: t} = useTranslation();

  if (error) {
    return (
      <NonIdealState
        description={
          <Stack align="center" spacing="xs">
            <Text>{t("results.error_execquery_detail")}</Text>
            <Text>{error}</Text>
          </Stack>
        }
        icon={<IconAlertTriangle color="orange" size="5rem" />}
      />
    );
  }

  if (isServerOnline === false) {
    if (typeof window === "object" && window.navigator.onLine === false) {
      // user is browser not connected to internet
      return <NonIdealState
        icon={<IconWorld color="orange" size="5rem" />}
        title={t("results.error_disconnected_title")}
      />;
    }

    return <NonIdealState
      icon={<IconAlertTriangle color="orange" size="5rem" />}
      title={t("results.error_serveroffline_title")}
      description={
        <Text span>
          {t("results.error_serveroffline_detail")}
          <Anchor href={serverUrl} target="_blank" rel="noopener noreferrer">{serverUrl}</Anchor>.
        </Text>
      }
    />;
  }

  if (!cube || queryItem.isDirty) {
    return props.splash || null;
  }

  if (data.length === 0) {
    return (
      <NonIdealState
        icon={<IconBox color="orange" size="5rem" />}
        title={t("results.error_emptyresult_title")}
        description={t("results.error_emptyresult_detail")}
      />
    );
  }

  const currentPanel = panels[currentTab];
  const CurrentComponent = currentPanel.component;

  return (
    <Flex
      direction="column"
      id="query-results"
      h="100%"
      w="100%"
      sx={{
        overflow: "hidden"
      }}
    >
      <Tabs
        id="query-results-tabs"
        onTabChange={newTab => {
          const index = panels.findIndex(panel => panel.key === newTab);
          setCurrentTab(index);
        }}
        value={currentPanel.key}
      >
        <Tabs.List>
          {panels.map(panel =>
            <Tabs.Tab key={panel.key} id={panel.key} value={panel.key}>
              {t(panel.label)}
            </Tabs.Tab>
          )}
          <Tabs.Tab disabled ml="auto" value="_results">
            <Title order={5}>{t("results.count_rows", {n: data.length})}</Title>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Box h="100%">
        <Suspense fallback={props.splash}>
          <PreviewModeMessage />
          <CurrentComponent cube={cube} params={params} result={result} />
        </Suspense>
      </Box>
    </Flex>
  );
}
