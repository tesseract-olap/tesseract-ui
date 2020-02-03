import {HTMLSelect, InputGroup} from "@blueprintjs/core";
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
 * @property {string} locale
 * @property {{label: string, value: string}[]} localeOptions
 */

/**
 * @typedef DispatchProps
 * @property {(event: React.ChangeEvent<HTMLSelectElement>) => void} updateLocaleHandler
 */

/** @type {React.FC<OwnProps&StateProps&DispatchProps>} */
const SelectLocale = ({
  className,
  fill,
  locale,
  localeOptions,
  updateLocaleHandler
}) =>
  <HTMLSelect
    className={classNames("select-locale", className)}
    fill={fill}
    onChange={updateLocaleHandler}
    options={localeOptions}
    value={locale}
  />;

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  locale: selectLocaleCode(state) || "en",
  localeOptions: selectLocaleOptions(state)
});

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  updateLocaleHandler: evt => dispatch(doLocaleSet(evt.target.value))
});

export default connect(mapState, mapDispatch)(SelectLocale);
