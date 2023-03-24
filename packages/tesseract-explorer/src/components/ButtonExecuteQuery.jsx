import {Box, Button, Group, Stack, Tooltip} from "@mantine/core";
import {IconCircleMinus, IconDatabase, IconReplace} from "@tabler/icons-react";
import React, {useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {willRequestQuery} from "../middleware/olapActions";
import {doCutClear, doDrilldownClear, doMeasureClear} from "../state/params/actions";
import {selectValidQueryStatus} from "../state/params/selectors";
import {doUpdateEndpoint} from "../state/server/actions";
import {selectServerEndpoint, selectServerSoftware} from "../state/server/selectors";
import {LoadAllResultsSwitch} from "./LoadAllResultsSwitch";

/** @type {React.FC<{}>} */
export const ButtonExecuteQuery = () => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const endpoint = useSelector(selectServerEndpoint);
  const software = useSelector(selectServerSoftware);

  const {isValid, error} = useSelector(selectValidQueryStatus);
  const errorText = error && t(error) !== error ? t(error) : "";

  const executeButtonProps = useMemo(() => {
    if (!isValid) {
      return {
        "data-disabled": true
      }; 
    }
    return {};
  }, [isValid]);

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
                dispatch(willRequestQuery());
              }}
              sx={{"&[data-disabled]": {pointerEvents: "all"}}}
              {...executeButtonProps}
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
              onClick={() => dispatch(doUpdateEndpoint())}
              variant="filled"
            >
              <IconReplace />
            </Button>
          </Tooltip>}
        </Group>
        <Box id="switch-params-load-all-results">
          <LoadAllResultsSwitch />
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
                dispatch(doCutClear());
                dispatch(doDrilldownClear());
                dispatch(doMeasureClear());
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
