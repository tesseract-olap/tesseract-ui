import {Button, ButtonGroup} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doDownloadQuery} from "../middleware/actions";
import {selectCurrentQueryItem} from "../state/queries/selectors";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {boolean} isDirty
 */

/** @type {React.FC<OwnProps & StateProps & import("react-redux").DispatchProp>} */
export const DownloadOptions = props => {
  const {translate: t} = useTranslation();
  return props.isDirty
    ? null
    : <div className="download-area">
      <h4>{t("params.title_downloaddata")}</h4>
      <ButtonGroup fill>
        <Button onClick={() => props.dispatch(doDownloadQuery("csv"))}>CSV</Button>
        <Button onClick={() => props.dispatch(doDownloadQuery("jsonarrays"))}>JSON Arrays</Button>
        <Button onClick={() => props.dispatch(doDownloadQuery("jsonrecords"))}>JSON Records</Button>
      </ButtonGroup>
    </div>;
};

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = selectCurrentQueryItem;

export const ConnectedDownloadOptions = connect(mapState)(DownloadOptions);
