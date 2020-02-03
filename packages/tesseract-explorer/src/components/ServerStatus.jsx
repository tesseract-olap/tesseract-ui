import {AnchorButton, Intent} from "@blueprintjs/core";
import React, {memo} from "react";
import {connect} from "react-redux";
import { selectUiState } from "../selectors/state";

/**
 * @typedef StateProps
 * @property {boolean|undefined} online
 * @property {string} software
 * @property {string} url
 * @property {string} version
 */

/** @type {React.FC<StateProps>} */
const ServerStatus = function({online, software, url, version}) {
  if (online === true) {
    return (
      <AnchorButton
        href={url}
        icon="database"
        intent={Intent.SUCCESS}
        minimal={true}
        tabIndex={null}
        target="_blank"
        text={`${software} v${version}`}
      />
    );
  }
  if (online === false) {
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
};

/** @type {import("react-redux").MapStateToProps<StateProps, {}, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  const ui = selectUiState(state);
  return {
    online: ui.serverOnline,
    software: ui.serverSoftware,
    url: ui.serverUrl,
    version: ui.serverVersion
  };
}

export default connect(mapStateToProps)(memo(ServerStatus));
