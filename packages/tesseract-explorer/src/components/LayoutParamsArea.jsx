import {Accordion, ActionIcon, Box, Group, ScrollArea, Text, Tooltip} from "@mantine/core";
import {IconAlertTriangleFilled, IconInfoCircleFilled} from "@tabler/icons-react";
import React from "react";

const stopBubbling = evt => {
  evt.preventDefault();
  evt.stopPropagation();
};

/**
 * @typedef OwnProps
 * @property {React.ReactNode} children
 * @property {string} title
 * @property {React.ReactNode} [toolbar]
 * @property {string} [tooltip]
 * @property {string} [warning]
 * @property {string} [maxHeight]
 * @property {string} value
 */

/** @type {React.FC<OwnProps>} */
export const LayoutParamsArea = props => {
  const {tooltip, warning} = props;
  return (
    <Accordion.Item value={props.value}>
      <Accordion.Control px="xs">
        <Group noWrap position="apart">
          <Group noWrap spacing="xs">
            <Text>
              {props.title}
            </Text>
            {tooltip && 
              <Tooltip label={tooltip} withinPortal>
                <ActionIcon color="blue">
                  <IconInfoCircleFilled />
                </ActionIcon>
              </Tooltip>
            }
          </Group>
          {!warning && <Box onClick={stopBubbling}>
            {props.toolbar}
          </Box>}
          {warning && <ActionIcon color="orange">
            <IconAlertTriangleFilled />
          </ActionIcon>}
        </Group>
      </Accordion.Control> 
      <Accordion.Panel>
        <ScrollArea mah={props.maxHeight}>
          {props.children}
        </ScrollArea>
      </Accordion.Panel>
    </Accordion.Item>
  );
};
