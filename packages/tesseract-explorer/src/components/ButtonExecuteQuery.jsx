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
    <Box>
      <Stack spacing="xs">
        <Group noWrap spacing="xs">
          <Tooltip 
            color="red"
            disabled={isValid}
            label={errorText}
            position="right"
            withArrow
            withinPortal
          >
            <Button
              fullWidth
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
            label={t("params.current_endpoint", {label: endpoint})}
            position="right"
            withArrow
          >
            <Button
              color="gray"
              onClick={() => dispatch(doUpdateEndpoint())}
              variant="filled"
            >
              <IconReplace />
            </Button>
          </Tooltip>}
        </Group>
        <Box>
          <LoadAllResultsSwitch />
        </Box>
        <Group noWrap spacing="xs">
          <Tooltip 
            color="red"
            label={t("params.action_clear_description")}
            position="right"
            withArrow
            withinPortal
          >
            <Button 
              color="red"
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
