import {ButtonGroup, Classes, Intent, Position} from "@blueprintjs/core";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {willExecuteQuery} from "../middleware/olapActions";
import {doSetLoadingState} from "../state/loading/actions";
import {doCutClear, doDrilldownClear, doMeasureClear} from "../state/params/actions";
import {selectValidQueryStatus} from "../state/params/selectors";
import {doUpdateEndpoint} from "../state/server/actions";
import {selectServerEndpoint, selectServerSoftware} from "../state/server/selectors";
import {AnchorButtonTooltip, ButtonTooltip} from "./Tooltips";

/** @type {React.FC<{}>} */
export const ButtonExecuteQuery = () => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const endpoint = useSelector(selectServerEndpoint);
  const software = useSelector(selectServerSoftware);

  const {isValid, error} = useSelector(selectValidQueryStatus);
  const errorText = error && t(error) !== error ? t(error) : "";

  return (
    <>
      <ButtonGroup className="query-actions p-3" fill>
        <AnchorButtonTooltip
          fill={true}
          disabled={!isValid}
          icon="database"
          intent={Intent.PRIMARY}
          text={t("params.action_execute")}
          tooltipText={errorText}
          tooltipIntent={Intent.DANGER}
          tooltipPosition={Position.RIGHT}
          onClick={() => {
            dispatch(doSetLoadingState("REQUEST"));
            dispatch(willExecuteQuery()).then(() => {
              dispatch(doSetLoadingState("SUCCESS"));
            }, error => {
              dispatch(doSetLoadingState("FAILURE", error.message));
            });
          }}
        />
        {software === "tesseract-olap" && <ButtonTooltip
          className={Classes.FIXED}
          icon="exchange"
          tooltipText={t("params.current_endpoint", {label: endpoint})}
          onClick={() => dispatch(doUpdateEndpoint())}
        />}
      </ButtonGroup>
      <ButtonGroup className="query-actions p-3 pt-0" fill>
        <AnchorButtonTooltip
          fill={true}
          icon="remove"
          intent={Intent.NONE}
          text={t("params.action_clear")}
          tooltipText={t("params.action_clear_description")}
          tooltipIntent={Intent.NONE}
          tooltipPosition={Position.RIGHT}
          onClick={() => {
            dispatch(doCutClear());
            dispatch(doDrilldownClear());
            dispatch(doMeasureClear());
          }}
        />
      </ButtonGroup>
    </>
  );
};
