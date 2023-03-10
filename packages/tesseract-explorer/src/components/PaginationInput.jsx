import {Group, Input, NumberInput} from "@mantine/core";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doPaginationUpdate} from "../state/params/actions";
import {selectIsFullResults, selectPaginationParams} from "../state/params/selectors";

/**
 * @typedef PaginationInputProps
 * @property {string} [className]
 */

/** @type {React.FC<PaginationInputProps>} */
export const PaginationInput = () => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const {limit, offset} = useSelector(selectPaginationParams);

  const isFullResults = useSelector(selectIsFullResults);

  return (
    <Group noWrap spacing="xs">
      <Input.Wrapper label={t("params.label_pagination_limit")}>
        <NumberInput
          disabled={!isFullResults}
          min={0}
          onChange={limit => dispatch(doPaginationUpdate(limit, offset))}
          value={limit}
        />
      </Input.Wrapper>
      <Input.Wrapper label={t("params.label_pagination_offset")}>
        <NumberInput
          disabled={!isFullResults}
          min={0}
          onChange={offset => dispatch(doPaginationUpdate(limit, offset))}
          value={offset}
        />
      </Input.Wrapper>
    </Group>
  );
};
