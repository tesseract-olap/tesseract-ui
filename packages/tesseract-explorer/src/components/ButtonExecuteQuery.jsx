import {ActionIcon, Button, Group, Tooltip} from "@mantine/core";
import {IconDatabase, IconTrash} from "@tabler/icons-react";
import React, {useCallback} from "react";
import {useSelector} from "react-redux";
import {useActions} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectValidQueryStatus, selectCurrentQueryParams} from "../state/queries";

/** @type {React.FC<{}>} */
export const ButtonExecuteQuery = () => {
  const actions = useActions();

  const {translate: t} = useTranslation();

  const {isValid, error} = useSelector(selectValidQueryStatus);
  const {cube, locale, measures} = useSelector(selectCurrentQueryParams);

  const errorText = error ? t(error) : "";

  return (
    <Group id="button-group-execute-query" noWrap spacing="xs">
      <Tooltip
        color="red"
        disabled={isValid}
        events={{
          hover: true,
          focus: false,
          touch: true
        }}
        label={errorText}
        multiline
        withArrow
        withinPortal
      >
        <Button
          disabled={!isValid}
          fullWidth
          id="button-execute-query"
          leftIcon={<IconDatabase />}
          onClick={useCallback(() => {
            actions.willRequestQuery();
          }, [])}
          sx={{"&[data-disabled]": {pointerEvents: "all"}}}
        >
          {t("params.action_execute")}
        </Button>
      </Tooltip>

      <Tooltip
        events={{hover: true, focus: false, touch: true}}
        label={t("params.action_clear_description")}
        multiline
        withArrow
        withinPortal
      >
        <ActionIcon
          color="red"
          id="button-clear-params"
          onClick={useCallback(() => {
            actions.resetAllParams({
              cube,
              locale,
              measures: Object.keys(measures)
                .filter(key => measures[key].key)
                .reduce((prev, k) => ({...prev, [k]: {...measures[k], active: false}}), {})
            });
          }, [])}
          size="lg"
        >
          <IconTrash />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};
