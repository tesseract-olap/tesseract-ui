import {NonIdealState, Overlay, Spinner} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {selectLoadingState} from "../state/loading/selectors";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {boolean} isOpen
 */

/** @type {React.FC<OwnProps & StateProps>} */
const LoadingScreen = props =>
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
  </Overlay>;


/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  isOpen: selectLoadingState(state).loading
});

export default connect(mapState)(LoadingScreen);
