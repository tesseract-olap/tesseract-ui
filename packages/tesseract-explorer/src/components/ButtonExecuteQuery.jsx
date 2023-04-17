import {ActionIcon, Box, Button, Group, Stack, Tooltip} from "@mantine/core";
import {IconCircleMinus, IconDatabase, IconReplace, IconTrash} from "@tabler/icons-react";
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
              disabled={!isValid}
              fullWidth
              id="button-execute-query"
              leftIcon={<IconDatabase />}
              onClick={() => {
                actions.willRequestQuery();
              }}
              sx={{"&[data-disabled]": {pointerEvents: "all"}}}
              // {...executeButtonProps}
            >
              {t("params.action_execute")}
            </Button>
          </Tooltip>
          {/* software === "tesseract-olap" && <Tooltip
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
            </Tooltip>*/}
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
              onClick={() => {
                actions.resetAllParams({});
              }}
              size="lg"
              variant="filled"
            >
              <IconTrash />
            </ActionIcon>  
          </Tooltip>
        </Group>
        <Box id="switch-params-load-all-results">
          <PreviewModeSwitch />
        </Box>
      </Stack>
    </Box>
  );
};
