import {Button, ButtonGroup, Classes, Intent} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {doExecuteQuery} from "../middleware/actions";
import {doUpdateEndpoint} from "../state/server/actions";
import {selectServerEndpoint} from "../state/server/selectors";
import ButtonTooltip from "../components/ButtonTooltip";

/**
 * @typedef {import("@blueprintjs/core").IButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>} ButtonProps
 */

/**
 * @typedef StateProps
 * @property {string | null} endpoint
 */

/**
 * @typedef DispatchProps
 * @property {() => void} executeQueryHandler
 * @property {() => void} updateEndpointHandler
 */

/** @type {React.FC<StateProps & DispatchProps>} */
const ButtonExecuteQuery = props => {
  const execButton = <Button
    fill={true}
    icon="database"
    intent={Intent.PRIMARY}
    text="Execute query"
    onClick={props.executeQueryHandler}
  />;

  if (!props.endpoint) return execButton;

  return (
    <ButtonGroup fill={true}>
      {execButton}
      <ButtonTooltip
        className={Classes.FIXED}
        icon="exchange"
        tooltip={`Current endpoint: ${props.endpoint}`}
        onClick={props.updateEndpointHandler}
      />
    </ButtonGroup>
  );
};

/** @type {TessExpl.State.MapStateFn<StateProps, {}>} */
const mapState = state => ({
  endpoint: selectServerEndpoint(state)
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

export default connect(mapState, mapDispatch)(ButtonExecuteQuery);
