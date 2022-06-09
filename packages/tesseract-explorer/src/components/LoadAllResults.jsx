import {Button, Callout} from "@blueprintjs/core";
import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {useSettings} from "../hooks/settings";
import {doSetLoadingState} from "../state/loading/actions";
import {willExecuteQuery} from "../middleware/olapActions";
import {doPaginationUpdate, doBooleanToggle} from "../state/params/actions";
import {selectPaginationParams, selectBooleans} from "../state/params/selectors";

/**
 * @typedef LoadAllResultsProps
 */

/** @type {React.FC<LoadAllResultsProps>} */
export const LoadAllResults = () => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const {limit, offset} = useSelector(selectPaginationParams);

  const {full_results} = useSelector(selectBooleans);

  const {previewLimit} = useSettings();

  const onClickLoadAllResults = useCallback(() => {

    //Update limit and full results
    dispatch(doPaginationUpdate(!full_results ? 0 : previewLimit, offset))
    dispatch(doBooleanToggle("full_results")),

    //Run the query again
    dispatch(doSetLoadingState("REQUEST"));
    dispatch(willExecuteQuery()).then(() => {
      dispatch(doSetLoadingState("SUCCESS"));
    }, error => {
      dispatch(doSetLoadingState("FAILURE", error.message));
    });

  },[]);

  return (
    <Callout>
      <p>
        <strong>{full_results ? t("previewMode.title_full") : t("previewMode.title_preview")}:</strong>
        {" "}
        {full_results ? t("previewMode.description_full") : t("previewMode.description_preview", {limit: previewLimit})}
        {" "}
        <Button small={true} minimal={true} icon="database" intent="primary" className="load-all-btn" onClick={onClickLoadAllResults}>
          {full_results ? t("previewMode.btn_get_preview") : t("previewMode.btn_get_all")}
        </Button>
      </p>
    </Callout>
  );
};
