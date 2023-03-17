import { Box, Navbar, Paper, ScrollArea, Title, UnstyledButton } from "@mantine/core";
import React, { useState } from "react";

/**
 * @typedef OwnProps
 * @property {React.ReactNode} children
 * @property {boolean} [defaultOpen]
 * @property {string} title
 */

/** @type {React.FC<OwnProps>} */
export const LayoutColumn = props => {
  const {defaultOpen: initialOpenState = true} = props;
  const [isOpen, setOpen] = useState(initialOpenState);

  const toggleHandler = () => setOpen(!isOpen);

  if (!isOpen) {
    return (
      <Paper py="sm" px={5} radius={0} w="max-content" withBorder>
        <UnstyledButton sx={{display: "grid"}} onClick={toggleHandler}>
          <Title
            order={4}
            tt="uppercase"
            sx={{writingMode: "vertical-rl"}}
          >
            {props.title}
          </Title>
        </UnstyledButton>
      </Paper>
    );
  }

  return (
    <Navbar px="md" py="xs" w={380} withBorder zIndex={10}>
      <Navbar.Section>
        <UnstyledButton onClick={toggleHandler}>
          <Title order={4} tt="uppercase">
            {props.title}
          </Title>
        </UnstyledButton>
      </Navbar.Section>
      <Navbar.Section component={ScrollArea} grow mx="-md" px="md" w={380}>
        <Box>{props.children}</Box>
      </Navbar.Section>
    </Navbar>
  );
};
