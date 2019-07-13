import React from "react";
import {connect} from "react-redux"
import {Intent, AnchorButton} from "@blueprintjs/core";

/**
 * @typedef StateProps
 * @property {string} status
 * @property {string} url
 * @property {string} version
 */

/** @type {React.FC<StateProps>} */
const ServerStatus = function(props) {
  if (props.status === "ok") {
    return (
      <AnchorButton
        intent={Intent.SUCCESS}
        minimal={true}
        tabIndex={null}
        href={props.url}
        target="_blank"
        text={props.version}
      />
    );
  }
  if (props.status === "unavailable") {
    return (
      <AnchorButton
        intent={Intent.WARNING}
        minimal={true}
        tabIndex={null}
        text="Server unavailable"
      />
    );
  }
  return (
    <AnchorButton disabled={true} tabIndex={null} text="Retrieving server info..." />
  );
}

/** @type {import("react-redux").MapStateToProps<StateProps, {}, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  return {
    status: state.explorerUi.serverStatus,
    url: state.explorerUi.serverUrl,
    version: state.explorerUi.serverVersion
  }
}

export default connect(mapStateToProps)(ServerStatus);
