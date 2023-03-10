import {Box, Card, Navbar, ScrollArea, Title, UnstyledButton} from "@mantine/core";
import React, {useState} from "react";

/**
 * @typedef OwnProps
 * @property {React.ReactNode} children
 * @property {string} [className]
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
      <Card px="xs" radius={0} withBorder w="max-content">
        <UnstyledButton onClick={toggleHandler}>
          <Title 
            order={4} 
            tt="uppercase"
            sx={{
              writingMode: "vertical-rl"
            }}
          >  
            {props.title}
          </Title>
        </UnstyledButton>
      </Card>
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
      <Navbar.Section component={ScrollArea} grow mx="-md" px="md">
        <Box>{props.children}</Box>
      </Navbar.Section>
    </Navbar>
  );
};
