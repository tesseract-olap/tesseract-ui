import {Box, Input, Stack, Text} from "@mantine/core";
import {Prism} from "@mantine/prism";
import React, {useMemo} from "react";
import {useTranslation} from "../hooks/translation";
import {DebugURL} from "./DebugURL";

/** @type {React.FC<import("./ExplorerResults").ViewProps>} */
export const DebugView = props => {
  const {sourceCall, url} = props.result;

  const {translate: t} = useTranslation();

  const jssourceLabel =
    <Box>
      {t("debug_view.jssource_prefix")}
      <a href="https://www.npmjs.com/package/@datawheel/olap-client">olap-client</a>
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
          <DebugURL url={url} />
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
};
