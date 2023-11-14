import {Switch, ThemeIcon, Tooltip} from "@mantine/core";
import {IconInfoCircleFilled} from "@tabler/icons-react";
import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {useActions, useSettings} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectIsPreviewMode} from "../state/queries";
import {selectSerializedParams} from "../state/selectors";

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
    actions.updateIsPreview(!isPreviewMode);
  }, [isPreviewMode]);

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
      <Switch
        checked={!isPreviewMode}
        styles={{label: {display: "flex", alignContent: "center", gap: "0.25rem"}}}
        label={
          <>
            {t("params.label_boolean_full_results")}
            {!noPopover &&
                <ThemeIcon variant="subtle" size="sm">
                  <IconInfoCircleFilled />
                </ThemeIcon>}
          </>
        }
        onChange={onClickLoadAllResults}
      />
    </Tooltip>
  );
};
