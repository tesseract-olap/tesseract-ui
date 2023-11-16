import {Anchor, Box, Button, Group, Input, Stack, Text} from "@mantine/core";
import {useClipboard} from "@mantine/hooks";
import {Prism} from "@mantine/prism";
import {IconClipboard, IconExternalLink, IconWorld} from "@tabler/icons-react";
import React, {useCallback, useMemo} from "react";
import {useTranslation} from "../hooks/translation";
import {ViewProps} from "./ExplorerResults";

/** */
export function DebugView(props: ViewProps) {
  const {sourceCall, url} = props.result;

  const {translate: t} = useTranslation();

  const {copy, copied} = useClipboard({timeout: 1000});

  const copyHandler = useCallback(() => copy(url), [url]);

  const openHandler = useCallback(() => window.open(url, "_blank"), [url]);

  const jssourceLabel =
    <Box component="span">
      {t("debug_view.jssource_prefix")}
      <Anchor href="https://www.npmjs.com/package/@datawheel/olap-client">olap-client</Anchor>
      {t("debug_view.jssource_suffix")}
    </Box>;

  const headers = useMemo(() => {
    const headers = Object.entries(props.result.headers || {});
    if (headers.length === 0) return null;

    return (
      <Input.Wrapper label={t("debug_view.httpheaders")}>
        <dl>{headers.map(entry =>
          <React.Fragment key={entry[0]}>
            <dt>
              <Text fw="bold" fz="sm">{entry[0]}</Text>
            </dt>
            <dd>
              <Text c="#5c940d" fz="sm">{entry[1]}</Text>
            </dd>
          </React.Fragment>
        )}</dl>
      </Input.Wrapper>
    );
  }, [props.result.headers]);

  return (
    <Box id="query-results-debug-view" p="md">
      <Stack spacing="md">
        {url && <Input.Wrapper label={t("debug_view.url_logiclayer")}>
          <Group noWrap spacing="xs">
            <Input
              icon={<IconWorld />}
              readOnly
              rightSectionWidth="auto"
              value={url}
              w="100%"
            />
            <Button.Group>
              <Button
                leftIcon={<IconExternalLink />}
                onClick={openHandler}
                variant="default"
              >
                {t("action_open")}
              </Button>
              <Button
                leftIcon={<IconClipboard />}
                onClick={copyHandler}
                variant="default"
              >
                {copied ? t("action_copy_done") : t("action_copy")}
              </Button>
            </Button.Group>
          </Group>
        </Input.Wrapper>}

        {sourceCall && <Input.Wrapper label={jssourceLabel}>
          <Prism language="javascript">
            {sourceCall}
          </Prism>
        </Input.Wrapper>}

        {headers}
      </Stack>
    </Box>
  );
}
