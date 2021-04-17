/* eslint-disable comma-dangle */

import { createContext, createElement, useContext } from "react";

/**
 * @typedef SettingsContextProps
 * @property {Record<string, (d: number) => string>} formatters
 */

/**
 * @typedef SettingsProviderProps
 * @property {Record<string, (d: number) => string>} [formatters]
 */

/**
 * The shared Context object.
 * @type {React.Context<SettingsContextProps | undefined>}
 */
const SettingsContext = createContext(undefined);

/**
 * A wrapper for the Provider, to handle the changes and API given by the hook.
 * @type {React.FC<SettingsProviderProps>}
 */
export const SettingsProvider = props => {
  const value = {
    formatters: props.formatters || {},
  };
  return createElement(SettingsContext.Provider, {value}, props.children);
};

/**
 * A wrapper for the Consumer, for use with class components.
 * @type {React.FC<React.ConsumerProps<SettingsContextProps>>}
 */
export const SettingsConsumer = props =>
  createElement(SettingsContext.Consumer, undefined, context => {
    if (context === undefined) {
      throw new Error("SettingsConsumer must be used within a SettingsProvider.");
    }
    return props.children(context);
  });

/**
 * The React hook associated to the settings context.
 * @returns {SettingsContextProps}
 */
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider.");
  }
  return context;
}
