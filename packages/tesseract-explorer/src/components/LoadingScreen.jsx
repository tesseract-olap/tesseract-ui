import {NonIdealState, Overlay, Spinner} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {useTranslation} from "../hooks/translation";
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
const LoadingScreen = props => {
  const {translate: t} = useTranslation();
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
        title={t("loading")}
      />
    </Overlay>
  );
};

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  isOpen: selectLoadingState(state).loading
});

export default connect(mapState)(LoadingScreen);
