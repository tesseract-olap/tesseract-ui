import {Anchor, Avatar, Box, Flex, Stack, Tabs, Text, Title} from "@mantine/core";
import {IconAlertTriangle, IconBox, IconWorld} from "@tabler/icons-react";
import React, {Suspense, useState} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {selectCurrentQueryItem} from "../state/queries/selectors";
import {selectOlapCube} from "../state/selectors";
import {selectServerState} from "../state/server/selectors";
import {LoadAllResultsMessage} from "./LoadAllResultsMessage";
import {NonIdealState} from "./NonIdealState";

/**
 * @typedef OwnProps
 * @property {any} [DefaultSplash]
 * @property {React.ReactElement | React.ReactFragment | false} transientIcon
 * @property {Record<string, React.FunctionComponent | React.ComponentClass>} panels
 */

/** @type {React.FC<OwnProps>} */
export const ExplorerResults = props => {
  const {DefaultSplash, panels, transientIcon} = props;
  const [currentTab, setCurrentTab] = useState(() => Object.keys(panels)[0]);

  const serverStatus = useSelector(selectServerState);
  const cube = useSelector(selectOlapCube);
  const queryItem = useSelector(selectCurrentQueryItem);

  const {online: isServerOnline, url: serverUrl} = serverStatus;
  const {isDirty: isDirtyQuery, params, result} = queryItem;
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
  
  if (isDirtyQuery) {
    return (
      DefaultSplash && <DefaultSplash/> ||
      <NonIdealState
        icon={transientIcon}
      />
    );
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

  const CurrentComponent = panels[currentTab];

  return (
    <Flex 
      direction="column"
      h="100%"
      w="100%"
      sx={{
        overflow: "scroll"
      }}
    >
      <Tabs
        onTabChange={newTab => setCurrentTab(`${newTab}`)}
        value={currentTab}
      >
        <Tabs.List>
          {Object.keys(panels).map(key => <Tabs.Tab id={key} key={key} value={key}>{t(key)}</Tabs.Tab>)}
          <Tabs.Tab disabled ml="auto" value="results">
            <Title order={5}>{t("results.count_rows", {n: data.length})}</Title>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Box h="100%">
        <Suspense fallback={typeof transientIcon === "string" ? <Avatar>{transientIcon}</Avatar> : transientIcon}>
          <LoadAllResultsMessage />
          <CurrentComponent cube={cube} params={params} result={result} />
        </Suspense>
      </Box>
    </Flex>
  );
};
