import {PlainCube} from "@datawheel/olap-client";
import {Alert, Anchor, Box, Group, Paper, Stack, Tabs, TabsValue, Text, Title} from "@mantine/core";
import {IconAlertTriangle, IconBox, IconWorld} from "@tabler/icons-react";
import React, {Suspense, useCallback, useState} from "react";
import {useSelector} from "react-redux";
import {useSettings} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectCurrentQueryItem, selectIsPreviewMode} from "../state/queries";
import {selectOlapCube} from "../state/selectors";
import {selectServerState} from "../state/server";
import {QueryParams, QueryResult} from "../utils/structs";
import {PreviewModeSwitch} from "./PreviewModeSwitch";

export interface ViewProps<TData = Record<string, string | number>> {
  className?: string;
  cube: PlainCube;
  params: QueryParams;
  result: QueryResult<TData>;
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
  className?: string;
  splash: React.ReactElement | null;
  panels: PanelDescriptor[];
}) {
  const cube = useSelector(selectOlapCube);
  const serverStatus = useSelector(selectServerState);
  const {isDirty, params, result} = useSelector(selectCurrentQueryItem);

  const {online: isServerOnline, url: serverUrl} = serverStatus;
  const {data, error} = result;

  const {translate: t} = useTranslation();

  // Check if client is browser and is not connected to internet
  if (typeof window === "object" && window.navigator.onLine === false) {
    return (
      <TransientResult
        className={props.className}
        icon={<IconWorld color="orange" size="5rem" />}
        title={t("results.error_disconnected_title")}
      />
    );
  }

  // Check if remote server is not working
  if (isServerOnline === false) {
    return (
      <TransientResult
        className={props.className}
        icon={<IconAlertTriangle color="orange" size="5rem" />}
        title={t("results.error_serveroffline_title")}
        description={
          <Text span>
            {t("results.error_serveroffline_detail")}
            <Anchor href={serverUrl} target="_blank" rel="noopener noreferrer">{serverUrl}</Anchor>.
          </Text>
        }
      />
    );
  }

  // Show splash if the schema is not fully loaded, server hasn't been checked,
  // or the user changed parameters since last query
  if (isServerOnline == null || !cube || isDirty) {
    return (
      <Paper id="query-results-transient" className={props.className} radius={0}>
        {props.splash || null}
      </Paper>
    );
  }

  // Check if there was an error in the last query
  if (error) {
    return (
      <TransientResult
        className={props.className}
        icon={<IconAlertTriangle color="orange" size="5rem" />}
        description={
          <Stack align="center" spacing="xs">
            <Text>{t("results.error_execquery_detail")}</Text>
            <Text>{error}</Text>
          </Stack>
        }
      />
    );
  }

  // Check if the query executed but returned an empty dataset
  if (data.length === 0) {
    return (
      <TransientResult
        className={props.className}
        icon={<IconBox color="orange" size="5rem" />}
        title={t("results.error_emptyresult_title")}
        description={t("results.error_emptyresult_detail")}
      />
    );
  }

  return (
    <SuccessResult
      className={props.className}
      cube={cube}
      panels={props.panels}
      params={params}
      result={result}
    >
      {props.splash}
    </SuccessResult>
  );
}

/** */
function TransientResult(props: {
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  title?: string | undefined;
}) {
  return (
    <Paper
      id="query-results-transient"
      className={props.className}
      radius={0}
      withBorder
      sx={{
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "center"
      }}
    >
      <Stack align="center" spacing="xs">
        {props.icon && props.icon}
        {props.title && <Title order={5}>{props.title}</Title>}
        {props.description && <Text>{props.description}</Text>}
        {props.children && props.children}
        {props.action && props.action}
      </Stack>
    </Paper>
  );
}

/**
 * Handles the currently active tab and its contents.
 */
function SuccessResult(props: {
  children?: React.ReactNode;
  className?: string;
  cube: PlainCube;
  panels: PanelDescriptor[];
  params: QueryParams;
  result: QueryResult;
}) {
  const {cube, panels, params, result} = props;

  const {translate: t} = useTranslation();

  const {previewLimit} = useSettings();

  const isPreviewMode = useSelector(selectIsPreviewMode);

  // TODO: move this state to QueryItem, set via actions
  const [currentTab, setCurrentTab] = useState(0);

  const tabHandler = useCallback((newTab: TabsValue) => {
    const index = panels.findIndex(panel => panel.key === newTab);
    setCurrentTab(index);
  }, [panels, setCurrentTab]);

  const currentPanel = panels[currentTab];
  const CurrentComponent = currentPanel.component;

  return (
    <Paper
      id="query-results-success"
      className={props.className}
      radius={0}
      withBorder
      sx={{
        display: "flex",
        flexFlow: "column nowrap"
      }}
    >
      <Tabs
        id="query-results-tabs"
        onTabChange={tabHandler}
        value={currentPanel.key}
      >
        <Tabs.List>
          {panels.map(panel =>
            <Tabs.Tab key={panel.key} id={panel.key} value={panel.key}>
              {t(panel.label)}
            </Tabs.Tab>
          )}
          <Tabs.Tab disabled ml="auto" value="_results">
            <Title order={5}>{t("results.count_rows", {n: result.data.length})}</Title>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {isPreviewMode &&
        <Alert id="alert-load-all-results" color="yellow" radius={0} sx={{flex: "0 0 auto"}}>
          <Group position="apart">
            <Text>
              <Text fw={700} span>{t("previewMode.title_preview")}: </Text>
              <Text span>{t("previewMode.description_preview", {limit: previewLimit})}</Text>
            </Text>
            <PreviewModeSwitch noPopover={true} />
          </Group>
        </Alert>}

      <Box id="query-results-content" sx={{flex: "1 1"}} h={{base: "auto", md: 0}}>
        <Suspense fallback={props.children}>
          <CurrentComponent cube={cube} params={params} result={result} />
        </Suspense>
      </Box>
    </Paper>
  );
}
