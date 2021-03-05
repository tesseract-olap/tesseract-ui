import React from "react";
import {connect} from "react-redux";
import {SelectObject} from "../components/Select";
import {doLocaleSet} from "../middleware/actions";
import {selectLocale} from "../state/params/selectors";
import {selectLocaleOptions} from "../state/server/selectors";
import {useTranslation} from "../utils/localization";

/** @type {React.FC<import("../components/Select").SelectObjectProps<{label: string, value: string}>>} */
const SelectLocaleOptions = SelectObject;

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {string} localeName
 * @property {{label: string, value: string}[]} localeOptions
 */

/**
 * @typedef DispatchProps
 * @property {(locale: {label: string, value: string}) => void} updateLocaleHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
export const SelectLocale = props => {
  const {translate: t} = useTranslation();

  if (props.localeOptions.length < 2) {
    return null;
  }

  return (
    <SelectLocaleOptions
      className="select-locale"
      fill={true}
      getLabel={item => item.label}
      icon="translate"
      items={props.localeOptions}
      onItemSelect={props.updateLocaleHandler}
      selectedItem={t("params.label_locale", {label: props.localeName})}
    />
  );
};

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  localeName: selectLocale(state).nativeName,
  localeOptions: selectLocaleOptions(state)
});

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  updateLocaleHandler(locale) {
    dispatch(doLocaleSet(locale.value));
  }
});

export const ConnectedSelectLocale = connect(mapState, mapDispatch)(SelectLocale);
