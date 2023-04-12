import {Box, Button, Group, Stack, Tooltip} from "@mantine/core";
import {IconCircleMinus, IconDatabase, IconReplace} from "@tabler/icons-react";
import React from "react";
import {useSelector} from "react-redux";
import {useActions} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectValidQueryStatus} from "../state/queries";
import {selectServerEndpoint, selectServerSoftware} from "../state/server";
import {PreviewModeSwitch} from "./PreviewModeSwitch";

/** @type {React.FC<{}>} */
export const ButtonExecuteQuery = () => {
  const actions = useActions();

  const {translate: t} = useTranslation();

  const endpoint = useSelector(selectServerEndpoint);
  const software = useSelector(selectServerSoftware);

  const {isValid, error} = useSelector(selectValidQueryStatus);
  const errorText = error ? t(error) : "";

  return (
    <Box id="button-group-execute-query">
      <Stack spacing="xs">
        <Group noWrap spacing="xs">
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
              fullWidth
              id="button-execute-query"
              leftIcon={<IconDatabase />}
              onClick={() => {
                actions.willRequestQuery();
              }}
              sx={{"&[data-disabled]": {pointerEvents: "all"}}}
              data-disabled={!isValid}
              // {...executeButtonProps}
            >
              {t("params.action_execute")}
            </Button>
          </Tooltip>
          {software === "tesseract-olap" && <Tooltip
            color="gray"
            events={{
              hover: true,
              focus: false,
              touch: true
            }}
            label={t("params.current_endpoint", {label: endpoint})}
            multiline
            withArrow
          >
            <Button
              color="gray"
              id="button-change-endpoint"
              onClick={() => {
                actions.updateEndpoint();
              }}
              variant="filled"
            >
              <IconReplace />
            </Button>
          </Tooltip>}
        </Group>
        <Box id="switch-params-load-all-results">
          <PreviewModeSwitch />
        </Box>
        <Group noWrap spacing="xs">
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
            <Button
              color="red"
              id="button-clear-params"
              fullWidth
              leftIcon={<IconCircleMinus />}
              onClick={() => {
                actions.resetAllParams({});
              }}
            >
              {t("params.action_clear")}
            </Button>
          </Tooltip>
        </Group>
      </Stack>
    </Box>
  );
};
