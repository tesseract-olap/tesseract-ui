import {NonIdealState, Overlay, Spinner, SpinnerSize} from "@blueprintjs/core";
import React from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {selectLoadingState} from "../state/loading/selectors";

/** @type {React.FC<Omit<import("@blueprintjs/core").IOverlayProps, "isOpen">>} */
export const LoadingOverlay = props => {
  const {translate: t} = useTranslation();

  const {loading: isLoading, message} = useSelector(selectLoadingState);

  /* eslint-disable indent, operator-linebreak */
  const description =
    !message                       ? undefined :
    message.type === "HEAVY_QUERY" ? t("loading.message_heavyquery", message) :
    /* else */                       t("loading.message_default", message);
  /* eslint-enable indent, operator-linebreak */

  return (
    <Overlay
      canEscapeKeyClose={false}
      canOutsideClickClose={false}
      {...props}
      isOpen={isLoading}
    >
      <NonIdealState
        className="loading-screen"
        icon={<Spinner size={SpinnerSize.LARGE} />}
        title={t("loading.title")}
        description={description}
      />
    </Overlay>
  );
};
