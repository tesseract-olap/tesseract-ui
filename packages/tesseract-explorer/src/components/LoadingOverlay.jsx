import {NonIdealState, Overlay, Spinner} from "@blueprintjs/core";
import React from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {selectLoadingState} from "../state/loading/selectors";

/** @type {React.FC<Omit<import("@blueprintjs/core").IOverlayProps, "isOpen">>} */
export const LoadingOverlay = props => {
  const {translate: t} = useTranslation();

  const loadingState = useSelector(selectLoadingState);

  return (
    <Overlay
      canEscapeKeyClose={false}
      canOutsideClickClose={false}
      {...props}
      isOpen={loadingState.loading}
    >
      <NonIdealState
        className="loading-screen"
        icon={<Spinner size={Spinner.SIZE_LARGE} />}
        title={t("loading")}
      />
    </Overlay>
  );
};
