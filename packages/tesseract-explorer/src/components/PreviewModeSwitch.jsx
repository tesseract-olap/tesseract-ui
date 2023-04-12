import {Group, Switch, ThemeIcon, Tooltip} from "@mantine/core";
import {IconInfoCircleFilled} from "@tabler/icons-react";
import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {useActions, useSettings} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectIsPreviewMode} from "../state/queries";
import { selectSerializedParams } from "../state/selectors";

/**
 * @typedef LoadAllResultsSwitchProps
 * @property {boolean} [noPopover]
 */

/** @type {React.FC<LoadAllResultsSwitchProps>} */
export const PreviewModeSwitch = props => {
  const actions = useActions();

  const {translate: t} = useTranslation();

  const isPreviewMode = useSelector(selectIsPreviewMode);
  const serialParams = useSelector(selectSerializedParams);

  const {previewLimit} = useSettings();

  const noPopover = props.noPopover ? true : false;

  useEffect(() => {
    isPreviewMode && actions.willRequestQuery();
  }, [isPreviewMode, serialParams]);

  const onClickLoadAllResults = useCallback(() => {
    actions.updatePreviewLimit(isPreviewMode ? 0 : previewLimit);
  }, [previewLimit, isPreviewMode]);

  return (
    <Tooltip
      color="blue"
      disabled={noPopover}
      events={{
        hover: true,
        focus: false,
        touch: true
      }}
      label={isPreviewMode
        ? t("previewMode.description_preview", {limit: previewLimit})
        : t("previewMode.description_full")}
      multiline
      withArrow
      withinPortal
    >
      <Group noWrap spacing="xs" w="max-content">
        <Switch
          checked={!isPreviewMode}
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
