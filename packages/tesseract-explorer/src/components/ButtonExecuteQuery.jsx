import {Button, ButtonGroup, Classes, Intent} from "@blueprintjs/core";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {willExecuteQuery} from "../middleware/olapActions";
import {doSetLoadingState} from "../state/loading/actions";
import {doUpdateEndpoint} from "../state/server/actions";
import {selectServerEndpoint, selectServerSoftware} from "../state/server/selectors";
import {ButtonTooltip} from "./Tooltips";

/** @type {React.FC<{}>} */
export const ButtonExecuteQuery = () => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const endpoint = useSelector(selectServerEndpoint);
  const software = useSelector(selectServerSoftware);

  return (
    <ButtonGroup className="query-actions p-3" fill>
      <Button
        fill={true}
        icon="database"
        intent={Intent.PRIMARY}
        text={t("params.action_execute")}
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
  );
};
