import {HTMLSelect} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import {connect} from "react-redux";
import {doLocaleSet} from "../middleware/actions";
import {selectLocaleCode} from "../state/params/selectors";
import {selectLocaleOptions} from "../state/server/selectors";

/**
 * @typedef OwnProps
 * @property {boolean} [fill]
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {boolean} isEnabled
 * @property {string} locale
 * @property {{label: string, value: string}[]} localeOptions
 */

/**
 * @typedef DispatchProps
 * @property {(event: React.ChangeEvent<HTMLSelectElement>) => void} updateLocaleHandler
 */

/** @type {React.FC<OwnProps&StateProps&DispatchProps>} */
export const SelectLocale = props => props.isEnabled
  ? <HTMLSelect
    className={classNames("select-locale", props.className)}
    fill={props.fill}
    onChange={props.updateLocaleHandler}
    options={props.localeOptions}
    value={props.locale}
  />
  : null;

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => {
  const localeOptions = selectLocaleOptions(state);
  return {
    isEnabled: localeOptions.length > 1,
    locale: selectLocaleCode(state) || "en",
    localeOptions
  };
};

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  updateLocaleHandler: evt => dispatch(doLocaleSet(evt.target.value))
});

export const ConnectedSelectLocale = connect(mapState, mapDispatch)(SelectLocale);
