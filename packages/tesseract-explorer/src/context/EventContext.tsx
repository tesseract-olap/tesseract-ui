import React, { createContext, useCallback, useContext, useRef } from "react";

export type EventHandler = (type: string, payload?: Record<string, unknown>) => void;

const noop: EventHandler = (_type, _payload) => undefined;

const EventContext = createContext<EventHandler>(noop);

const { Consumer: ContextConsumer, Provider: ContextProvider } = EventContext;

export function EventProvider(props: { children?: React.ReactNode; onEvent?: EventHandler }) {
  const onEventRef = useRef<EventHandler>(noop);
  onEventRef.current = props.onEvent || noop;

  const stableOnEvent = useCallback<EventHandler>((type, payload) => {
    const { key, ...props } = payload || {};
    onEventRef.current(type, { timestamp: Date.now(), ...props });
  }, []);

  return <ContextProvider value={stableOnEvent}>{props.children}</ContextProvider>;
}

export function EventConsumer(props: React.ConsumerProps<EventHandler>) {
  return <ContextConsumer>{props.children}</ContextConsumer>;
}

export function useLogger(): EventHandler {
  const context = useContext(EventContext);
  return context;
}
