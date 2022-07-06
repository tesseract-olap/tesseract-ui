import {Icon, Popover, PopoverInteractionKind, Switch} from "@blueprintjs/core";
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
    <Popover
      boundary="viewport"
      content={
        <div className="p-3">
          {isFullResults ? t("previewMode.description_full") : t("previewMode.description_preview", {limit: previewLimit})}
        </div>
      }
      fill={false}
      interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
      popoverClassName="show-full-results-popover"
      disabled={noPopover}
    >
      <Switch inline={true}
        checked={isFullResults}
        labelElement={
          <>
            {t("params.label_boolean_full_results")}
            {!noPopover && <Icon className="ml-1" icon="info-sign" />}
          </>}
        onChange={onClickLoadAllResults} />
    </Popover>
  );
};
