import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {willExecuteQuery} from "../middleware/olapActions";
import {doSetLoadingState} from "../state/loading/actions";
import {doLocaleUpdate} from "../state/params/actions";
import {selectLocale} from "../state/params/selectors";
import {selectLocaleOptions} from "../state/server/selectors";
import {SelectObject} from "./Select";

/** @type {React.FC<import("./Select").SelectObjectProps<{label: string, value: string}>>} */
const SelectLocaleOptions = SelectObject;

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
export const SelectLocale = () => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const currentLocale = useSelector(selectLocale);
  const localeOptions = useSelector(selectLocaleOptions);

  if (localeOptions.length < 2) {
    return null;
  }

  return (
    <SelectLocaleOptions
      className="select-locale"
      fill={true}
      getLabel={item => item.label}
      icon="translate"
      items={localeOptions}
      onItemSelect={locale => {
        if (currentLocale.code !== locale.value) {
          dispatch(doSetLoadingState("REQUEST"));
          dispatch(doLocaleUpdate(locale.value));
          dispatch(willExecuteQuery()).then(() => {
            dispatch(doSetLoadingState("SUCCESS"));
          }, error => {
            dispatch(doSetLoadingState("FAILURE", error.message));
          });
        }
      }}
      selectedItem={t("params.label_locale", currentLocale)}
    />
  );
};
