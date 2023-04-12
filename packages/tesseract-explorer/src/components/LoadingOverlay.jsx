import {Flex, Loader, LoadingOverlay as MantineLoadingOverlay, Space, Text, Title} from "@mantine/core";
import React from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {selectLoadingState} from "../state/loading";

/** @type {React.FC} */
export const LoadingOverlay = () => {
  const {translate: t} = useTranslation();

  const {loading: isLoading, message} = useSelector(selectLoadingState);

  /* eslint-disable indent, operator-linebreak */
  const description =
    !message                       ? undefined :
    message.type === "HEAVY_QUERY" ? t("loading.message_heavyquery", message) :
    /* else */                       t("loading.message_default", message);
  /* eslint-enable indent, operator-linebreak */

  const customLoader =
    <Flex
      justify="center"
      align="center"
      direction="column"
    >
      <Loader size="xl" />
      <Space h="md" />
      <Title order={4}>{t("loading.title")}</Title>
      <Text>{description}</Text>
    </Flex>
  ;

  return (
    <MantineLoadingOverlay
      loader={customLoader}
      visible={isLoading}
      sx={{
        position: "fixed",
        top: 0
      }}
    />
  );
};
