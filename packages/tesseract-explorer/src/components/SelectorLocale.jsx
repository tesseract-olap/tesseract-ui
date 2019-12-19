import {HTMLSelect} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {setLocale} from "../middleware/actions";
import {selectLocaleOptions} from "../selectors/query";

/**
 * @typedef OwnProps
 * @property {boolean} [fill]
 */

/**
 * @typedef StateProps
 * @property {string} locale
 * @property {{label: string, value: string}[]} localeOptions
 */

/**
 * @typedef DispatchProps
 * @property {() => any} updateLocaleHandler
 */

/** @type {React.FC<OwnProps&StateProps&DispatchProps>} */
const LocaleSelector = function({fill, locale, localeOptions, updateLocaleHandler}) {
  return (
    <HTMLSelect
      className="select-locale"
      fill={fill}
      onChange={updateLocaleHandler}
      options={localeOptions}
      value={locale}
    />
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
function mapStateToProps(state) {
  return {
    locale: state.explorerQuery.locale || "en",
    localeOptions: selectLocaleOptions(state)
  };
}

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
function mapDispatchToProps(dispatch) {
  return {
    updateLocaleHandler: evt => dispatch(setLocale(evt.target.value))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocaleSelector);
