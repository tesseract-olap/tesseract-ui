import {Button, ButtonGroup} from "@blueprintjs/core";
import React, {useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doDownloadQuery} from "../middleware/actions";
import {selectCurrentQueryItem} from "../state/queries/selectors";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {Record<OlapClient.Format, string>} [formats]
 */

/** @type {Required<Pick<OwnProps, "formats">>} */
const defaultProps = {
  formats: {
    csv: "CSV",
    jsonrecords: "JSON Records",
    jsonarrays: "JSON Arrays"
  }
};

/** @type {React.FC<OwnProps>} */
export const AreaDownloadQuery = props => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const queryItem = useSelector(selectCurrentQueryItem);

  const formats = props.formats || defaultProps.formats;
  const buttons = useMemo(() => Object.entries(formats).map(format =>
    <Button
      key={format[0]}
      onClick={() => dispatch(doDownloadQuery(format[0]))}
      text={format[1]}
    />
  ), [formats]);

  if (queryItem.isDirty || buttons.length === 0) {
    return null;
  }

  return (
    <div className="download-area p-3">
      <h4 className="mt-0 mb-3">{t("params.title_downloaddata")}</h4>
      <ButtonGroup fill>{buttons}</ButtonGroup>
    </div>
  );
};

AreaDownloadQuery.defaultProps = defaultProps;
