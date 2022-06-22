import {Switch, Popover, PopoverInteractionKind} from "@blueprintjs/core";
import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {useSettings} from "../hooks/settings";
import {doSetLoadingState} from "../state/loading/actions";
import {willExecuteQuery} from "../middleware/olapActions";
import {doFullResultsPagination} from "../state/params/actions";
import {selectBooleans} from "../state/params/selectors";
import {Icon} from "@blueprintjs/core";

/**
 * @typedef LoadAllResultsSwitchProps
 */

/** @type {React.FC<LoadAllResultsSwitchProps>} */
export const LoadAllResultsSwitch = (props) => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const {full_results} = useSelector(selectBooleans);

  const {previewLimit} = useSettings();

  const noPopover = props.noPopover?true:false;

  const onClickLoadAllResults = useCallback(() => {

    //Update limit and full results
    dispatch(doFullResultsPagination(!full_results ? 0 : previewLimit, !full_results));

    //Run the query again - TO DO HANDLE IN MIDDLEWARE: REMOVE
    dispatch(doSetLoadingState("REQUEST"));
    dispatch(willExecuteQuery()).then(() => {
      dispatch(doSetLoadingState("SUCCESS"));
    }, error => {
      dispatch(doSetLoadingState("FAILURE", error.message));
    });

  }, [full_results]);

  return (
    <Popover
      boundary="viewport"
      content={
        <div className="p-3">
          {full_results ? t("previewMode.description_full") : t("previewMode.description_preview", {limit: previewLimit})}
        </div>
      }
      fill={false}
      interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
      popoverClassName="show-full-results-popover"
      disabled={noPopover}
    >
      <Switch inline={true}
        checked={full_results}
        className=""
        labelElement={
        <>
          {t("params.label_boolean_full_results")}
            {!noPopover && <Icon className="ml-1" icon="info-sign" />}
        </>}
      onChange={onClickLoadAllResults} />
    </Popover>
  );
};
