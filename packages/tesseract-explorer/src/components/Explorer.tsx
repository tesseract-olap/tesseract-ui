import {TranslationContextProps, TranslationProviderProps} from "@datawheel/use-translation";
import {MantineProvider} from "@mantine/core";
import React, {useMemo, useRef, useState} from "react";
import {Provider as ReduxProvider, useStore} from "react-redux";
import {SettingsProvider} from "../hooks/settings";
import {TranslationDict, TranslationProvider} from "../hooks/translation";
import {Formatter} from "../utils/types";
import {DebugView} from "./DebugView";
import {ExplorerContent} from "./ExplorerContent";
import {PanelDescriptor} from "./ExplorerResults";
import {PermalinkSync} from "./PermalinkSync";
import {PivotView} from "./PivotView";
import {TableView} from "./TableView";
import { storeFactory } from "../state";

/**
 * Main DataExplorer component
 * This components wraps the interface components in the needed Providers,
 * and pass the other properties to them.
 */
export function ExplorerComponent(props: {

  /**
   * A reference to the server with the data.
   * Can be setup as a string with the URL of the server, or a
   * [AxiosRequestConfig](https://github.com/axios/axios#request-config)
   * for more complex handling of authorization/authentication.
   */
  source: import("@datawheel/olap-client").ServerConfig;

  /**
   * A list of the available locale options.
   * If passed a string, will be splitted by commas (`,`) to try to interpret a list.
   */
  dataLocale?: string | string[];

  /**
   * Defines an index of formatter functions available to the measures shown
   * in the app, besides a limited list of default ones. The key used comes
   * from `measure.annotations.units_of_measurement`, if present.
   */
  formatters?: Record<string, Formatter>;

  /**
   * The list of tabs to offer to the user to render the results.
   * Must be an array of objects with the following properties:
   * - `key`: a string to distinguish each panel, will be used in the URL params
   * - `label`: a string used as the title for the panel in the tab bar.
   * It will be passed through the internal translation function, so can be
   * localized via the `translations` property or used directly as is.
   * - `component`: a non-hydrated React Component.
   * This will be passed the needed properties according to the specification.
   * Rendering the panel supports the use of `React.lazy` to defer the load of
   * heavy dependencies.
   */
  panels?: PanelDescriptor[];

  /**
   * The default limit for preview queries.
   * @default 50
   */
  previewLimit?: number;

  /**
   * A component that is rendered to display the default "splash screen";
   * the screen that is shown in the results panel when there is no query,
   * or a query has been dirtied.
   */
  splash?: React.ComponentType<{ translation: TranslationContextProps }>;

  /**
   * The Translation labels to use in the UI.
   */
  translations?: Record<string, TranslationDict>;

  /**
   * The default locale to use in the Explorer component UI.
   * This value is passed to the Translation utility and controls the language
   * for the labels throughout the user interface. Must be equal to one of the
   * keys in the object provided to the `translations` property.
   * @default "en"
   */
  uiLocale?: TranslationProviderProps["defaultLocale"];

  /**
   * Determines whether Explorer should be rendered within a MantineProvider
   * @default true
   */
  withinMantineProvider?: boolean;

  /**
   * Determines whether Explorer should be rendered within a Redux Provider,
   * encapsulating its state, and making easier to install.
   * @default false
   */
  withinReduxProvider?: boolean,

  /**
   * Enables multiple queries mode.
   * This adds a column where the user can quickly switch between queries,
   * like tabs in a browser.
   * @default false
   */
  withMultiQuery?: boolean;

  /**
   * Enables browser permalink synchronization.
   * @default false
   */
  withPermalink?: boolean;
}) {
  const {
    dataLocale = "en",
    previewLimit = 50,
    withinMantineProvider = true,
    withinReduxProvider = false,
    withMultiQuery = false
  } = props;

  const locale = useMemo(() => dataLocale.toString().split(","), [dataLocale]);

  const panels = useMemo(() => props.panels || [
    {key: "table", label: "table_view.tab_label", component: TableView},
    {key: "pivot", label: "pivot_view.tab_label", component: PivotView},
    {key: "debug", label: "debug_view.tab_label", component: DebugView}
  ], [props.panels]);

  const store = withinReduxProvider ? useMemo(storeFactory, []) : useStore();

  let content =
    <SettingsProvider
      store={store}
      formatters={props.formatters}
      previewLimit={previewLimit}
    >
      <TranslationProvider
        defaultLocale={props.uiLocale}
        translations={props.translations}
      >
        <ExplorerContent
          source={props.source}
          dataLocale={locale}
          previewLimit={previewLimit}
          panels={panels}
          splash={props.splash}
          withMultiQuery={withMultiQuery}
        />
        {props.withPermalink && <PermalinkSync />}
      </TranslationProvider>
    </SettingsProvider>;


  if (withinMantineProvider) {
    content = <MantineProvider withNormalizeCSS>{content}</MantineProvider>;
  }
  if (withinReduxProvider) {
    content = <ReduxProvider store={store}>{content}</ReduxProvider>;
  }

  return content;
}

ExplorerComponent.defaultProps = {
  version: process.env.BUILD_VERSION || "dev"
};
ExplorerComponent.displayName = "TesseractExplorer";
