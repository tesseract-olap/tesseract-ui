import {Group, Input, NumberInput} from "@mantine/core";
import React, {useCallback} from "react";
import {useSelector} from "react-redux";
import {useActions} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectIsPreviewMode, selectPaginationParams} from "../state/queries";

export const PaginationInput = () => {
  const actions = useActions();

  const {translate: t} = useTranslation();

  const {limit, offset} = useSelector(selectPaginationParams);

  const isPreviewMode = useSelector(selectIsPreviewMode);

  /** @type {(value: number | "") => void} */
  const onLimitChange = useCallback((limit = 0) => {
    actions.updatePagination({limit, offset});
  }, [offset]);

  /** @type {(value: number | "") => void} */
  const onOffsetChange = useCallback((offset = 0) => {
    actions.updatePagination({limit, offset});
  }, [limit]);

  return (
    <Group noWrap spacing="xs">
      <Input.Wrapper label={t("params.label_pagination_limit")}>
        <NumberInput
          disabled={isPreviewMode}
          min={0}
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
