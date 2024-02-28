import {Button, Group, Input, Select} from "@mantine/core";
import React, {useCallback, useMemo} from "react";
import {accesorFactory, identity, keyBy} from "../utils/transform";

type PropertyAccesor<T> =
  | (T extends string | number ? never : keyof T)
  | ((item: T) => string);

/** */
export function SelectObject<T>(props: {
  disabled?: boolean;
  getLabel?: PropertyAccesor<T>;
  getValue?: PropertyAccesor<T>;
  hidden?: boolean;
  items: T[];
  label?: string;
  loading?: boolean;
  onItemSelect?: (item: T) => void;
  searchable?: boolean;
  selectedItem?: T | string | null;
}) {
  const {getLabel, getValue = identity, items, onItemSelect, selectedItem} = props;

  const [itemList, itemMap] = useMemo(() => {
    const valueAccessor = accesorFactory(getValue);
    const labelAccessor = getLabel ? accesorFactory(getLabel) : valueAccessor;

    const list = items.map(item => ({
      label: labelAccessor(item),
      value: valueAccessor(item),
      item
    }));

    return [list, keyBy(list, option => option.value)];
  }, [items, getLabel, getValue]);

  const selected = useMemo(() => {
    if (selectedItem == null) return null;
    if (typeof selectedItem === "string") return selectedItem;
    const valueAccessor = accesorFactory(getValue);
    return valueAccessor(selectedItem);
  }, [selectedItem, getValue]);

  const itemSelectHandler = useCallback((value: string) => {
    onItemSelect && onItemSelect(itemMap[value].item);
  }, [itemMap]);

  if (items.length === 0 || !selected) {
    return null;
  }

  return (
    <Select
      data={itemList}
      disabled={props.loading || props.disabled}
      hidden={props.hidden}
      label={props.label}
      onChange={itemSelectHandler}
      onClick={inputFocusHandler}
      onFocus={inputFocusHandler}
      searchable={props.searchable ?? props.items.length > 6}
      value={selected}
    />
  );
}

/** */
export function SelectWithButtons<T>(props: {
  getLabel?: PropertyAccesor<T>;
  getValue?: PropertyAccesor<T>;
  hidden?: boolean;
  items: T[];
  label?: string;
  onItemSelect?: (item: T) => void;
  searchable?: boolean;
  selectedItem?: T | string | null;
}) {
  const {items, onItemSelect, selectedItem} = props;

  const buttons = useMemo(() => {
    if (items.length > 3) return null;

    const getValue = accesorFactory(props.getValue || identity);
    const getLabel = props.getLabel ? accesorFactory(props.getLabel) : getValue;
    const selected = typeof selectedItem === "string"
      ? selectedItem
      : selectedItem && getValue(selectedItem);

    return (
      <Input.Wrapper hidden={props.hidden} label={props.label}>
        <Group spacing="xs" grow>
          {items.map(item => {
            const value = getValue(item);
            return (
              <Button
                variant={selected === value ? "filled" : "outline"}
                key={value}
                onClick={onItemSelect ? () => onItemSelect(item) : undefined}
              >
                {getLabel(item)}
              </Button>
            );
          })}
        </Group>
      </Input.Wrapper>
    );
  }, [items, onItemSelect, selectedItem]);

  return buttons || <SelectObject
    getLabel={props.getLabel}
    getValue={props.getValue}
    hidden={props.hidden}
    items={items}
    label={props.label}
    onItemSelect={props.onItemSelect}
    searchable={props.searchable}
    selectedItem={selectedItem}
  />;
}

/** */
function inputFocusHandler(
  event: React.MouseEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>
) {
  if (event.target instanceof HTMLInputElement) event.target.select();
}
