import {Group, Input, NumberInput} from "@mantine/core";
import React, {useCallback} from "react";
import {useSelector} from "react-redux";
import {useLogger} from "../context/EventContext";
import {EventType} from "../events";
import {useActions, useSettings} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectIsPreviewMode, selectPaginationParams} from "../state/queries";

export const PaginationInput = () => {
  const actions = useActions();
  const log = useLogger();

  const {translate: t} = useTranslation();

  const {limit, offset} = useSelector(selectPaginationParams);

  const isPreviewMode = useSelector(selectIsPreviewMode);

  const {rowLimit} = useSettings();

  const onLimitChange = useCallback((value: number | "") => {
    const nextLimit = value ? value : 0;
    log(EventType.PaginationLimit, {limit: nextLimit, offset});
    actions.updatePagination({limit: nextLimit, offset});
  }, [offset]);

  const onOffsetChange = useCallback((value: number | "") => {
    const nextOffset = value ? value : 0;
    log(EventType.PaginationOffset, {limit, offset: nextOffset});
    actions.updatePagination({limit, offset: nextOffset});
  }, [limit]);

  return (
    <Group noWrap spacing="xs" align="start" grow>
      <Input.Wrapper
        label={t("params.label_pagination_limit")}
        description={rowLimit && !isPreviewMode ? t("params.label_pagination_limit_description", {limit: rowLimit}) : ""}
        inputWrapperOrder={["label", "input", "description"]}
      >
        <NumberInput
          disabled={isPreviewMode}
          min={0}
          max={rowLimit ? rowLimit : undefined}
          onChange={onLimitChange}
          value={limit}
        />
      </Input.Wrapper>
      <Input.Wrapper label={t("params.label_pagination_offset")}>
        <NumberInput
          disabled={isPreviewMode}
          min={0}
          onChange={onOffsetChange}
          value={offset}
        />
      </Input.Wrapper>
    </Group>
  );
};
