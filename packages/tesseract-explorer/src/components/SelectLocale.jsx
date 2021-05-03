import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doLocaleSet} from "../middleware/actions";
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

  const locale = useSelector(selectLocale);
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
        dispatch(doLocaleSet(locale.value));
      }}
      selectedItem={t("params.label_locale", locale)}
    />
  );
};
