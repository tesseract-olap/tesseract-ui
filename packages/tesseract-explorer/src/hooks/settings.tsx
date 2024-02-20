/* eslint-disable comma-dangle */
import {bindActionCreators} from "@reduxjs/toolkit";
import React, {createContext, useCallback, useContext, useMemo} from "react";
import {ExplorerStore, actions} from "../state";
import {ExplorerThunk} from "../state/store";
import {Formatter} from "../utils/types";
import {usePermalink} from "./permalink";

type ExplorerActionMap = typeof actions;
type ExplorerBoundActions = {
  [K in keyof ExplorerActionMap]:
    ExplorerActionMap[K] extends (...args: infer Params) => ExplorerThunk<infer R>
      ? (...args: Params) => R
      : ExplorerActionMap[K];
}

interface SettingsContextProps {
  actions: ExplorerBoundActions;
  defaultMembersFilter: "id" | "name" | "any";
  formatters: Record<string, Formatter>;
  previewLimit: number;
}

/**
 * The shared Context object.
 */
const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

const {Consumer: ContextConsumer, Provider: ContextProvider} = SettingsContext;

/**
 * A wrapper for the Provider, to handle the changes and API given by the hook.
 */
export function SettingsProvider(props: {
  children?: React.ReactElement;
  defaultMembersFilter?: "id" | "name" | "any";
  formatters?: Record<string, Formatter>;
  previewLimit?: number;
  store: ExplorerStore;
  withPermalink: boolean | undefined;
}) {
  usePermalink(props.withPermalink);

  // We need to cast this to unknown, then to ExplorerBoundActions for the
  // thunks' return value to be correctly converted
  const boundActions: unknown = useMemo(() =>
    bindActionCreators(actions, props.store.dispatch), []);

  const value: SettingsContextProps = useMemo(() => ({
    actions: boundActions as ExplorerBoundActions,
    defaultMembersFilter: props.defaultMembersFilter || "id",
    formatters: props.formatters || {},
    previewLimit: props.previewLimit || 50,
  }), [props.formatters, props.previewLimit]);

  return <ContextProvider value={value}>{props.children}</ContextProvider>;
}

/**
 * A wrapper for the Consumer, for use with class components.
 */
export function SettingsConsumer(props: React.ConsumerProps<SettingsContextProps>) {
  return (
    <ContextConsumer>
      {useCallback(context => {
        if (context === undefined) {
          throw new Error("SettingsConsumer must be used within a SettingsProvider.");
        }
        return props.children(context);
      }, [props.children])}
    </ContextConsumer>
  );
}

/**
 * The React hook associated to the settings context.
 */
export function useSettings(): SettingsContextProps {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider.");
  }
  return context;
}

/**
 * Returns a set of ready-to-call actions.
 */
export function useActions() {
  const context = useSettings();
  return context.actions;
}
