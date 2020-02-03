import {NonIdealState, Overlay, Spinner} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import { selectLoadingState } from "../selectors/state";

function LoadingScreen(props) {
  return (
    <Overlay
      canEscapeKeyClose={false}
      canOutsideClickClose={false}
      {...props}
      isOpen={props.isOpen}
    >
      <NonIdealState
        className="loading-screen"
        icon={<Spinner size={Spinner.SIZE_LARGE} />}
        title="Loading..."
      />
    </Overlay>
  );
}

/** @param {import("../reducers").ExplorerState} state */
function mapStateToProps(state) {
  return {
    isOpen: selectLoadingState(state).loading
  };
}

export default connect(mapStateToProps)(LoadingScreen);
