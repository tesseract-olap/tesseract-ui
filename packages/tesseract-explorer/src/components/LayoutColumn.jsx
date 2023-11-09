import {Navbar, Paper, Title, UnstyledButton} from "@mantine/core";
import React, {useState} from "react";

/**
 * @typedef OwnProps
 * @property {React.ReactNode} children
 * @property {boolean} [defaultOpen]
 * @property {string} id
 * @property {string} title
 */

/** @type {React.FC<OwnProps>} */
export const LayoutColumn = props => {
  const {defaultOpen: initialOpenState = true} = props;
  const [isOpen, setOpen] = useState(initialOpenState);

  const toggleHandler = () => setOpen(!isOpen);

  if (!isOpen) {
    return (
      <Paper
        id={`closed-layout-column-${props.id}`}
        withBorder
        radius={0}
        sx={theme => ({
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,

          [theme.fn.largerThan("md")]: {
            padding: `${theme.spacing.sm} ${theme.spacing.xs}`
          }
        })}
      >
        <UnstyledButton sx={{display: "grid"}} onClick={toggleHandler}>
          <Title order={4} sx={theme => ({
            lineHeight: 1,
            textTransform: "uppercase",
            writingMode: "vertical-rl",
            [theme.fn.smallerThan("md")]: {
              writingMode: "horizontal-tb"
            }
          })}>
            {props.title}
          </Title>
        </UnstyledButton>
      </Paper>
    );
  }

  return (
    <Navbar
      id={`layout-column-${props.id}`}
      withBorder
      sx={theme => ({
        height: "auto",
        padding: `${theme.spacing.xs} ${theme.spacing.md} ${theme.spacing.xl}`,
        zIndex: 10,

        [theme.fn.largerThan("md")]: {
          height: "100%",
          width: 380,
          padding: `${theme.spacing.xs} ${theme.spacing.md}`
        }
      })}
    >
      <Navbar.Section>
        <UnstyledButton onClick={toggleHandler}>
          <Title order={4} lh={1} tt="uppercase">
            {props.title}
          </Title>
        </UnstyledButton>
      </Navbar.Section>
      <Navbar.Section grow>
        {props.children}
      </Navbar.Section>
    </Navbar>
  );
};
