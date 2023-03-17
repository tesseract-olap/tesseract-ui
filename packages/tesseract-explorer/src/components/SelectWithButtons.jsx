import {Button, Group, Input} from "@mantine/core";
import React from "react";
import {SelectObject, SelectPrimitive} from "./Select";

/**
 * @template T
 * @typedef OwnProps
 * @property {T[]} items
 * @property {string} [label]
 * @property {(item: T, event?: React.SyntheticEvent<HTMLElement, Event> | undefined) => void} onItemSelect
 * @property {T} selectedItem
 * @property {string} [text]
 * @property {(item: T) => string} [getLabel]
 * @property {boolean} [hidden]
 */

/** @type {React.FC<OwnProps<any>>} */
export const SelectWithButtons = props => {
  const {items, selectedItem, getLabel} = props;

  if (props.hidden || items.length === 0 || !selectedItem) {
    return null;
  }

  if (items.length < 3) {
    return (
      <Input.Wrapper label={props.label}>
        <Group spacing="xs" grow>
          {items.map(item => {
            const label = getLabel ? getLabel(item) : item;
            return (
              <Button
                variant={selectedItem === item ? "filled" : "outline"}
                key={label}
                onClick={evt => props.onItemSelect(item, evt)}
              >
                {label}
              </Button>
            );
          })}
        </Group>
      </Input.Wrapper>
    );
  }

  if (getLabel) {
    return (
      <SelectObject
        getLabel={getLabel}
        label={props.label}
        items={items}
        onItemSelect={props.onItemSelect}
        selectedItem={props.text || getLabel(selectedItem)}
      />
    );
  }

  return (
    <SelectPrimitive
      items={items}
      label={props.label}
      onItemSelect={props.onItemSelect}
      selectedItem={props.text || selectedItem}
    />
  );
};
