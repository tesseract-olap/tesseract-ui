import {Button, ButtonGroup, Classes, Intent} from "@blueprintjs/core";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {ButtonTooltip} from "./Tooltips";
import {useTranslation} from "../hooks/translation";
import {doExecuteQuery} from "../middleware/actions";
import {doUpdateEndpoint} from "../state/server/actions";
import {selectServerEndpoint, selectServerSoftware} from "../state/server/selectors";

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
        onClick={() => dispatch(doExecuteQuery())}
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
