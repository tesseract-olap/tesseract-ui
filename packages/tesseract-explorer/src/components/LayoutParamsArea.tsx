import {Accordion, ActionIcon, Group, ScrollArea, Text, Tooltip} from "@mantine/core";
import {IconAlertTriangleFilled, IconInfoCircleFilled} from "@tabler/icons-react";
import React from "react";

export const LayoutParamsArea = (props: {
  children: React.ReactNode;
  id: string;
  title: string;
  toolbar?: React.ReactNode;
  tooltip?: string | undefined;
  warning?: string | undefined;
  value: string;
}) => {
  const tooltip = props.tooltip
    ? <Tooltip
      events={{hover: true, focus: false, touch: true}}
      label={props.tooltip}
      multiline
      withinPortal
    >
      <ActionIcon color="blue">
        <IconInfoCircleFilled />
      </ActionIcon>
    </Tooltip>
    : null;

  const toolbar = props.warning
    ? <ActionIcon color="orange">
      <IconAlertTriangleFilled />
    </ActionIcon>
    : props.toolbar;

  return (
    <Accordion.Item id={`layout-param-area-${props.id}`} value={props.value}>
      <Group noWrap spacing="xs" pr={toolbar ? "xs" : undefined}>
        <Accordion.Control px="xs">
          <Text>{props.title}</Text>
          {tooltip}
        </Accordion.Control>
        {toolbar}
      </Group>

      <Accordion.Panel>
        <ScrollArea styles={{viewport: {maxHeight: 390}}}>
          {props.children}
        </ScrollArea>
      </Accordion.Panel>
    </Accordion.Item>
  );
};
