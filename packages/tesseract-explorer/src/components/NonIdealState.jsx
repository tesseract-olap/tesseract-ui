import {Center, Stack, Text, Title} from "@mantine/core";
import React from "react";

/**
 * @typedef OwnProps
 * @property {React.ReactElement} [action]
 * @property {React.ReactElement} [children]
 * @property {string | React.ReactElement} [description]
 * @property {React.ReactFragment | React.ReactElement<any, string | React.JSXElementConstructor<any>> | boolean} [icon]
 * @property {string} [title]
 */

/** @type {React.FC<OwnProps>} */
export const NonIdealState = props => <Center 
  h="100%" 
  w="100%"
  sx={theme => ({
    [theme.fn.smallerThan("md")]: {
      minHeight: "100vh"
    }
  })}
>
  <Stack align="center" spacing="xs">
    {props.icon && props.icon}
    {props.title && <Title order={5}>{props.title}</Title>}
    {props.description && <Text>{props.description}</Text>}
    {props.children && props.children}
    {props.action && props.action} 
  </Stack>
</Center>;
