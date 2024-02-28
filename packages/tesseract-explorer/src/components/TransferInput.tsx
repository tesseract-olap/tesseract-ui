import {Avatar, Badge, Box, Button, Card, Checkbox, CloseButton, Group, Input, ScrollArea, Stack, Text, UnstyledButton} from "@mantine/core";
import {IconChevronsLeft, IconChevronsRight, IconSearch} from "@tabler/icons-react";
import React, {useCallback, useMemo, useRef, useState} from "react";
import ViewPortList from "react-viewport-list";
import {useTranslation} from "../hooks/translation";
import {hasOwnProperty} from "../utils/object";
import {QueryParamsItem} from "../utils/structs";
import {keyBy, safeRegExp} from "../utils/transform";

export type ItemPredicateFunction<T extends QueryParamsItem> =
  (query: RegExp, item: T, index: number) => boolean;
export type ItemPredicateMethod<T extends QueryParamsItem> =
  {label: string; method: ItemPredicateFunction<T>}

/** */
export function TransferInput<T extends QueryParamsItem>(props: {
  items: Record<string, T>;
  activeItems: string[];
  onChange: (items: string[]) => void;
  getLabel: (item: T) => string;
  getSecondLabel?: (item: T) => string | undefined;
  initialItemPredicateIndex?: number;
  itemPredicate?: ItemPredicateFunction<T> | {
    label: string;
    method: ItemPredicateFunction<T>;
  }[];
}) {
  const {activeItems, getLabel, items, itemPredicate, onChange} = props;
  const sideLabelRenderer = props.getSecondLabel || (() => undefined);

  const unselectedRef = useRef(null);
  const selectedRef = useRef(null);

  const {translate: t} = useTranslation();

  const [filter, setFilter] = useState("");
  const [itemPredicateIndex, setItemPredicateIndex] = useState(props.initialItemPredicateIndex || 0);

  const activeKeys = useMemo(
    () => keyBy(activeItems, key => key),
    [activeItems]
  );

  const results = useMemo(() => {
    const selected: T[] = [];
    const unselected: T[] = [];

    // If the user filters using a comma-separated list of words/numbers,
    // consider the commas as RegExp `|`
    const commaSeparated = /^[\s0-9A-Za-z,]+$/;
    const tester = commaSeparated.test(filter)
      ? safeRegExp(filter.replace(/,/g, "|"), "i")
      : safeRegExp(filter, "i");

    // If multiple options were provided, pick according to stored index
    // Else use unique option directly. Define a fallback if anything went wrong.
    const currentPredicate: ItemPredicateFunction<T> = (
      Array.isArray(itemPredicate)
        ? itemPredicate[itemPredicateIndex].method
        : itemPredicate
    ) || ((query, item) => query.test(item.key));

    let index = 0;
    const keys = Object.keys(items);

    while (index < keys.length) {
      const key = keys[index];
      const item = items[key];
      if (!currentPredicate(tester, item, index++)) continue;
      hasOwnProperty(activeKeys, key)
        ? selected.push(item)
        : unselected.push(item);
    }

    return {
      selected: selected.slice(0, 1000),
      selectedCount: selected.length,
      totalCount: keys.length,
      unselected: unselected.slice(0, 1000),
      unselectedCount: unselected.length
    };
  }, [items, activeKeys, filter, itemPredicateIndex]);

  const toggleHandler = useCallback(item => {
    const index = activeItems.indexOf(item.key);
    const nextActiveItems = activeItems.slice();
    if (index > -1) {
      nextActiveItems.splice(index, 1);
    }
    else {
      nextActiveItems.push(item.key);
      nextActiveItems.sort();
    }
    onChange(nextActiveItems);
  }, [activeItems, onChange]);

  const selectAllHandler = useCallback(() => {
    onChange([
      ...Object.keys(activeKeys), // currently active keys
      ...(results?.unselected || []).map(d => d.key) // plus currently filtered unselected keys
    ]);
  }, [results, activeKeys]);

  const unselectAllHandler = useCallback(() => {
    if (!results?.selectedCount) {
      onChange([]);
      return;
    }
    const filteredKeys = new Set((results?.selected || []).map(d => String(d.key)));
    const newActive = Object.keys(activeKeys).filter(k => !filteredKeys.has(k));
    onChange(newActive);
  }, [results, activeKeys]);

  const selectedHidden = activeItems.length - results.selectedCount;
  const unselectedHidden = results.totalCount - activeItems.length - results.unselectedCount;

  const rightElement = useMemo(() => {
    const resetButton = filter.length > 0
      ? <CloseButton mr="xs" onClick={() => setFilter("")} />
      : undefined;

    if (Array.isArray(itemPredicate)) {
      const currentPredicate = itemPredicate[itemPredicateIndex];
      const pickNextPredicate = () => {
        const nextIndex = itemPredicateIndex + 1;
        setItemPredicateIndex(nextIndex >= itemPredicate.length ? 0 : nextIndex);
      };
      return (
        <Group mr="xs" noWrap spacing="xs">
          <Badge
            leftSection={<Avatar
              color="blue"
              radius="xl"
              size="xs"
            >
              <IconSearch size={15} />
            </Avatar>}
            onClick={pickNextPredicate}
          >
            {currentPredicate.label}
          </Badge>
          {resetButton}
        </Group>
      );
    }

    return resetButton;
  }, [filter.length > 0, itemPredicateIndex]);

  const renderItem: (item: T, index: number) => React.ReactNode = item => <UnstyledButton
    key={item.key}
    onClick={toggleHandler.bind(null, item)}
    w="100%"
  >
    <Group
      noWrap
      position="apart"
      spacing="xs"
    >
      <Group noWrap spacing="xs">
        <Checkbox
          defaultChecked={hasOwnProperty(activeKeys, item.key)}
        />
        <Text
          fz="sm"
          lineClamp={1}
          sx={{
            wordBreak: "break-all"
          }}
        >{getLabel(item)}</Text>
      </Group>
      <Text c="gray" fz="xs">{sideLabelRenderer(item)}</Text>
    </Group>
  </UnstyledButton>;

  return (
    <Box
      w={500}
      sx={theme => ({
        [theme.fn.smallerThan("md")]: {
          maxWidth: "100%",
          width: "100%"
        }
      })}
    >
      <Stack spacing="xs">
        <Input
          icon={<IconSearch />}
          onChange={evt => setFilter(evt.target.value)}
          placeholder={t("transfer_input.search_placeholder")}
          rightSection={rightElement}
          rightSectionWidth="auto"
          value={filter}
        />
        <Group
          grow
          noWrap
          spacing="xs"
          sx={theme => ({
            [theme.fn.smallerThan("md")]: {
              flexDirection: "column"
            }
          })}
        >
          <Input.Wrapper
            label={t("transfer_input.unselected_items")}
            sx={theme => ({
              [theme.fn.smallerThan("md")]: {
                maxWidth: "100%",
                width: "100%"
              }
            })}
          >
            <Stack>
              <Card padding="xs" ref={unselectedRef} withBorder>
                <ScrollArea h={150} offsetScrollbars type="auto" viewportRef={unselectedRef}>
                  {unselectedHidden > 0 &&
                <Text c="gray" fz="sm" pb="sm">{t("transfer_input.count_hidden", {n: unselectedHidden})}</Text>
                  }
                  <ViewPortList items={results.unselected} itemMinSize={20} overscan={100} viewportRef={unselectedRef}>
                    {renderItem}
                  </ViewPortList>
                </ScrollArea>
              </Card>
              <Button
                disabled={results.unselected.length === 0}
                fullWidth
                rightIcon={<IconChevronsRight stroke={1.5} size={16} />}
                onClick={selectAllHandler}
                variant="outline"
              >
                {filter ? t("transfer_input.select_filtered") : t("transfer_input.select_all")}
              </Button>
            </Stack>
          </Input.Wrapper>
          <Input.Wrapper
            label={t("transfer_input.selected_items")}
            sx={theme => ({
              [theme.fn.smallerThan("md")]: {
                maxWidth: "100%",
                width: "100%"
              }
            })}
          >
            <Stack>
              <Card padding="xs" ref={selectedRef} withBorder>
                <ScrollArea h={150} offsetScrollbars type="auto" viewportRef={selectedRef}>
                  {selectedHidden > 0 &&
                  <Text c="gray" fz="sm" pb="sm">{t("transfer_input.count_hidden", {n: selectedHidden})}</Text>
                  }
                  <ViewPortList items={results.selected} itemMinSize={20} overscan={100} viewportRef={selectedRef}>
                    {renderItem}
                  </ViewPortList>
                </ScrollArea>
              </Card>
              <Button
                color="red"
                fullWidth
                disabled={results.selected.length === 0}
                leftIcon={<IconChevronsLeft stroke={1.5} size={16} />}
                onClick={unselectAllHandler}
                variant="outline"
              >
                {filter ? t("transfer_input.unselect_filtered") : t("transfer_input.unselect_all")}
              </Button>
            </Stack>
          </Input.Wrapper>
        </Group>
      </Stack>
    </Box>
  );
}

TransferInput.defaultProps = {
  getLabel: item => `${item}`
};
