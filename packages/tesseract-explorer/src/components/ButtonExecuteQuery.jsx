import {ActionIcon, Button, Group, Tooltip} from "@mantine/core";
import {IconDatabase, IconTrash} from "@tabler/icons-react";
import React, {useCallback} from "react";
import {useSelector} from "react-redux";
import {useActions} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectValidQueryStatus} from "../state/queries";

/** @type {React.FC<{}>} */
export const ButtonExecuteQuery = () => {
  const actions = useActions();

  const {translate: t} = useTranslation();

  const {isValid, error} = useSelector(selectValidQueryStatus);
  const errorText = error ? t(error) : "";

  const buttonExecute =
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
    </Tooltip>;

  const buttonReset =
    <Tooltip
      color="red"
      events={{
        hover: true,
        focus: false,
        touch: true
      }}
      label={t("params.action_clear_description")}
      multiline
      withArrow
      withinPortal
    >
      <ActionIcon
        color="red"
        id="button-clear-params"
        onClick={useCallback(() => {
          actions.resetAllParams({});
        }, [])}
        size="lg"
        variant="filled"
      >
        <IconTrash />
      </ActionIcon>
    </Tooltip>;

  return (
    <Group id="button-group-execute-query" noWrap spacing="xs">
      {buttonExecute}
      {buttonReset}
    </Group>
  );
};
