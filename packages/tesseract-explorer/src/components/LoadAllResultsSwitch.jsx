import {Group, Switch, ThemeIcon, Tooltip} from "@mantine/core";
import {IconInfoCircleFilled} from "@tabler/icons-react";
import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useSettings} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {doFullResultsPagination} from "../state/params/actions";
import {selectIsFullResults} from "../state/params/selectors";

/**
 * @typedef LoadAllResultsSwitchProps
 * @property {boolean} [noPopover]
 */

/** @type {React.FC<LoadAllResultsSwitchProps>} */
export const LoadAllResultsSwitch = props => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const isFullResults = useSelector(selectIsFullResults);

  const {previewLimit} = useSettings();

  const noPopover = props.noPopover ? true : false;

  const onClickLoadAllResults = useCallback(() => {
    // Update limit and full results
    dispatch(doFullResultsPagination(!isFullResults ? 0 : previewLimit, !isFullResults));
  }, [previewLimit, isFullResults]);

  return (
    <Tooltip
      color="blue"
      disabled={noPopover}
      label={isFullResults ? t("previewMode.description_full") : t("previewMode.description_preview", {limit: previewLimit})}
      position="right"
      withArrow
      withinPortal
    >
      <Group noWrap spacing="xs" w="max-content">
        <Switch
          checked={isFullResults}
          label={t("params.label_boolean_full_results")}
          onChange={onClickLoadAllResults} 
        />
        {!noPopover && <ThemeIcon 
          color="blue"
          // @ts-ignore
          variant="subtle"
        >
          <IconInfoCircleFilled />
        </ThemeIcon>}
      </Group>
    </Tooltip>
  );
};
