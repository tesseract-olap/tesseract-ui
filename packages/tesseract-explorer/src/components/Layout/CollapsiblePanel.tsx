import {DefaultProps, Paper, ScrollArea, Selectors, Stack, Title, UnstyledButton, useComponentDefaultProps} from "@mantine/core";
import React, {useCallback, useState} from "react";
import {useStyles, type CollapsiblePanelStyleParams} from "./CollapsiblePanel.styles";

export interface CollapsiblePanelProps
extends DefaultProps<Selectors<typeof useStyles>, CollapsiblePanelStyleParams> {
  children?: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  id: string;
  title: string;
  width?: number;
  withBorder?: boolean;
}

const defaultProps = {
  width: 380,
  withBorder: false
};

/** */
export function CollapsiblePanel(props: CollapsiblePanelProps) {
  const {defaultOpen: initialOpenState = true, classNames, styles, unstyled} = props;
  const styleOpts = {name: CollapsiblePanel.displayName, classNames, styles, unstyled};

  const {width, withBorder} = useComponentDefaultProps(styleOpts.name, defaultProps, props);

  const {classes, cx} = useStyles({width, withBorder}, styleOpts);

  const [isOpen, setOpen] = useState(initialOpenState);

  const toggleHandler = useCallback(() => {
    setOpen(isOpen => !isOpen);
  }, []);

  return (
    <Paper
      className={cx(props.className, classes.paper)}
      data-active={isOpen ? "true" : undefined}
      id={props.id}
      withBorder={withBorder}
    >
      <UnstyledButton className={classes.toggle} onClick={toggleHandler}>
        <Title order={4} className={classes.title}>
          {props.title}
        </Title>
      </UnstyledButton>
      {isOpen && <ScrollArea mx="-sm" px="sm">
        <Stack>{props.children}</Stack>
      </ScrollArea>}
    </Paper>
  );
}

CollapsiblePanel.displayName = "DEX-CollapsiblePanel";
