import {Box, Input, Stack, Text} from "@mantine/core";
import {Prism} from "@mantine/prism";
import React, {useMemo} from "react";
import {useTranslation} from "../hooks/translation";
import {DebugURL} from "./DebugURL";

/** @type {React.FC<TessExpl.ViewProps>} */
const ResultRaw = props => {
  const {headers, sourceCall, urlAggregate, urlLogicLayer} = props.result;

  const {translate: t} = useTranslation();

  const jssourceLabel =
    <Box>
      {t("debug_view.jssource_prefix")}
      <a href="https://www.npmjs.com/package/@datawheel/olap-client">olap-client</a>
      {t("debug_view.jssource_suffix")}
    </Box>;

  const dlHeaders = useMemo(() => Object.entries(headers).map(entry =>
    <Box key={entry[0]}>
      <dt>
        <Text fw="bold" fz="sm">
          {entry[0]}
        </Text>
      </dt>
      <dd>
        <Text c="#5c940d" fz="sm">
          {entry[1]}  
        </Text>
      </dd>
    </Box>
  ), [headers]);

  return (
    <Box p="md">
      <Stack spacing="md">
        {urlLogicLayer && <Input.Wrapper label={t("debug_view.url_logiclayer")}>
          <DebugURL url={urlLogicLayer} />
        </Input.Wrapper>}

        {urlAggregate && <Input.Wrapper label={t("debug_view.url_aggregate")}>
          <DebugURL url={urlAggregate} />
        </Input.Wrapper>}

        {sourceCall && <Input.Wrapper label={jssourceLabel}>
          <Prism language="javascript">
            {sourceCall}
          </Prism>
        </Input.Wrapper>}

        <Input.Wrapper label={t("debug_view.httpheaders")}>
          <dl>{dlHeaders}</dl>
        </Input.Wrapper>
      </Stack>
    </Box>
  );
};

export default ResultRaw;
