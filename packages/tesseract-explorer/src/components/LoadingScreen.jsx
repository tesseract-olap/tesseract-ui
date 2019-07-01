import {Spinner, Overlay, NonIdealState} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";

import {STATUS_FETCHING} from "../reducers/loadingReducer";

function LoadingScreen(props) {
  return (
    <Overlay
      canEscapeKeyClose={false}
      canOutsideClickClose={false}
      {...props}
      isOpen={props.status === STATUS_FETCHING}
    >
      <NonIdealState
        className="loading-screen"
        icon={
          <Spinner size={Spinner.SIZE_LARGE} />
        }
        title="Loading..."
      />
    </Overlay>
  );
}

/** @param {import("../reducers").ExplorerState} state */
function mapStateToProps(state) {
  return state.explorerLoading;
}

export default connect(mapStateToProps)(LoadingScreen);
