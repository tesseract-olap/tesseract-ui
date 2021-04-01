import {Button, Classes, Intent} from "@blueprintjs/core";
import React, {Fragment} from "react";
import {connect} from "react-redux";
import {ButtonTooltip} from "../components/Tooltips";
import {doExecuteQuery} from "../middleware/actions";
import {doUpdateEndpoint} from "../state/server/actions";
import {selectServerEndpoint, selectServerSoftware} from "../state/server/selectors";
import {useTranslation} from "../utils/localization";

/**
 * @typedef StateProps
 * @property {string} endpoint
 * @property {string} software
 */

/**
 * @typedef DispatchProps
 * @property {() => void} executeQueryHandler
 * @property {() => void} updateEndpointHandler
 */

/** @type {React.FC<StateProps & DispatchProps>} */
export const ButtonExecuteQuery = props => {
  const {translate: t} = useTranslation();

  const execButton = <Button
    fill={true}
    icon="database"
    intent={Intent.PRIMARY}
    text={t("params.action_execute")}
    onClick={props.executeQueryHandler}
  />;

  if (props.software !== "tesseract-olap") return execButton;

  return (
    <Fragment>
      {execButton}
      <ButtonTooltip
        className={Classes.FIXED}
        icon="exchange"
        tooltipText={t("params.current_endpoint", {label: props.endpoint})}
        onClick={props.updateEndpointHandler}
      />
    </Fragment>
  );
};

/** @type {TessExpl.State.MapStateFn<StateProps, {}>} */
const mapState = state => ({
  endpoint: selectServerEndpoint(state),
  software: selectServerSoftware(state)
});

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, {}>} */
const mapDispatch = dispatch => ({
  executeQueryHandler() {
    dispatch(doExecuteQuery());
  },
  updateEndpointHandler() {
    dispatch(doUpdateEndpoint());
  }
});

export const ConnectedButtonExecuteQuery = connect(mapState, mapDispatch)(ButtonExecuteQuery);
