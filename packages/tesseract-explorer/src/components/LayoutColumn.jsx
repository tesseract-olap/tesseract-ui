import { Box, Divider, Navbar, Paper, ScrollArea, Title, UnstyledButton } from "@mantine/core";
import React, { useState } from "react";

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
        py="sm" 
        px={5} 
        radius={0} 
        w="max-content" 
        withBorder
        sx={(theme) => ({
          [theme.fn.smallerThan("md")]: {
            padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
            width: "100%"
          }
        })}
      >
        <UnstyledButton sx={{display: "grid"}} onClick={toggleHandler}>
          <Title
            order={4}
            tt="uppercase"
            sx={(theme) => ({
              writingMode: "vertical-rl",
              [theme.fn.smallerThan("md")]: {
                writingMode: "horizontal-tb"
              }
            })}
          >
            {props.title}
          </Title>
        </UnstyledButton>
      </Paper>
    );
  }

  return (
    <Navbar 
      id={`layout-column-${props.id}`} 
      px="md" 
      py="xs" 
      w={380} 
      withBorder
      zIndex={10}
      sx={(theme) => ({
        [theme.fn.smallerThan("md")]: {
          height: "100%",
          width: "100%"
        }
      })}
    >
      <Navbar.Section>
        <UnstyledButton onClick={toggleHandler}>
          <Title order={4} tt="uppercase">
            {props.title}
          </Title>
        </UnstyledButton>
      </Navbar.Section>
      <Navbar.Section 
        component={ScrollArea} 
        grow 
        mx="-md" 
        px="md" 
        w={380}
        sx={(theme) => ({
          [theme.fn.smallerThan("md")]: {
            margin: 0,
            padding: `${theme.spacing.sm}px 0px`,
            width: "100%"
          }
        })}
      >
        <Box>{props.children}</Box>
      </Navbar.Section>
      <Divider mt="md" />
    </Navbar>
  );
};
