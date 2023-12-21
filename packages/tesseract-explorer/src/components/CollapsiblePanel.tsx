import {DefaultProps, Paper, ScrollArea, Selectors, Stack, Title, UnstyledButton, createStyles, useComponentDefaultProps} from "@mantine/core";
import React, {useCallback, useState} from "react";

export interface CollapsiblePanelStyleParams {
  width: number;
  withBorder: boolean;
}

export const useStyles = createStyles((theme, params: CollapsiblePanelStyleParams) => ({
  paper: {
    "borderRadius": 0,
    "padding": `${theme.spacing.xs} ${theme.spacing.md}`,

    [theme.fn.largerThan("md")]: {
      height: "100%",
      padding: `${theme.spacing.sm} ${theme.spacing.xs}`,
      writingMode: "vertical-rl"
    },

    "&[data-active]": {
      [theme.fn.largerThan("md")]: {
        display: "flex",
        flexFlow: "column nowrap",
        width: params.width,
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        writingMode: "horizontal-tb"
      }
    }
  },

  toggle: {
    marginBottom: theme.spacing.sm
  },

  title: {
    textTransform: "uppercase",
    lineHeight: 1
  }
}));

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

/** @type {React.FC<OwnProps>} */
export const CollapsiblePanel = props => {
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
};

CollapsiblePanel.displayName = "DEX-CollapsiblePanel";
