import {Button, Flex, Group, Text} from "@mantine/core";
import {IconBox, IconList, IconStack, IconTrash} from "@tabler/icons-react";
import React, {memo, useMemo} from "react";
import {useTranslation} from "../hooks/translation";
import {isActiveItem, shallowEqualExceptFns} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {boolean} active
 * @property {boolean} [hideDelete]
 * @property {TessExpl.Struct.QueryItem} item
 * @property {(key: string) => void} [onSelect]
 * @property {(key: string) => void} [onDelete]
 */

/** @type {React.FC<OwnProps>} */
export const StoredQuery = props => {
  const {onSelect, onDelete} = props;
  const {params} = props.item;
  const {translate: t} = useTranslation();

  const levelList = Object.values(params.drilldowns)
    .filter(isActiveItem)
    .map(item => item.level);
  const measureList = Object.values(params.measures)
    .filter(isActiveItem)
    .map(item => item.name);

  const iconProps = useMemo(() => ({
    size: 15
  }), []);

  return (
    <Button.Group>
      <Button
        fullWidth
        h="auto"
        mih={35}
        styles={{
          inner: {
            justifyContent: "flex-start"
          }
        }}
        onClick={() => onSelect && onSelect(props.item.key)}
        tabIndex={0}
        variant={props.active ? "filled" : "default"}
      >
        <Flex direction="column">
          {params.cube && <IconSpan icon={<IconBox {...iconProps} />} text={params.cube} />}
          {measureList.length > 0 && <IconSpan icon={<IconList {...iconProps} />} text={measureList.join(", ")} />}
          {levelList.length > 0 && <IconSpan icon={<IconStack {...iconProps} />} text={levelList.join(", ")} />}
          {!params.cube && <span>{t("queries.unset_parameters")}</span>}
        </Flex>
      </Button>
      <Button
        color="red"
        disabled={props.hideDelete}
        h="auto"
        onClick={() => onDelete && onDelete(props.item.key)}
        variant="filled"
      >
        <IconTrash />
      </Button>
    </Button.Group>
  );
};

const IconSpan = props =>
  <Group noWrap spacing="xs">
    {props.icon && props.icon}
    <Text 
      lineClamp={1}
      sx={{
        wordBreak: "break-all"
      }}
    >
      {props.text}
    </Text>
  </Group>;

export const MemoStoredQuery = memo(StoredQuery, shallowEqualExceptFns);
