import {ActionIcon, Text, Flex, rem} from "@mantine/core";
import {IconAdjustments} from "@tabler/icons-react";
import React from "react";
import {useTranslation} from "../hooks/translation";

/**
 *
 */
export function ColumnItem(props: {
  label: React.ReactNode;
  icon?: React.ReactNode;
  iconFilter?: React.ReactNode;
}) {
  const {translate: t} = useTranslation();

  const text = typeof props.label === "string"
    ? <Text sx={() => ({flexGrow: 1})}>{props.label}</Text>
    : props.label;

  return (
    <Flex
      gap="sm"
      px="sm"
      py="xs"
      sx={theme => ({
        display: "flex",
        alignItems: "center",
        marginBottom: `-${rem(1)}`,
        border: `${rem(1)} solid ${
          theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[4]
        }`,
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white
      })}
    >
      {props.icon}
      {text}
      <ActionIcon>
        {props.iconFilter || <IconAdjustments size="1.125rem" />}
      </ActionIcon>
    </Flex>
  );
}
