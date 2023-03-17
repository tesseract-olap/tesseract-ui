import {Select} from "@mantine/core";
import React, {useMemo} from "react";

/**
 * @typedef SelectPrimitiveProps
 * @property {boolean} [disabled]
 * @property {boolean} [hidden]
 * @property {any[]} items
 * @property {string | undefined} [label]
 * @property {boolean} [loading]
 * @property {(item: any, event?: React.SyntheticEvent<HTMLElement>) => void} onItemSelect
 * @property {boolean} [searchable]
 * @property {string | undefined} selectedItem
 */

/** @type {React.FC<SelectPrimitiveProps>} */
export const SelectPrimitive = props => {
  if (props.hidden) return null;
  
  return (
    <Select
      data={props.items}
      disabled={props.loading || props.disabled}
      label={props.label}
      onChange={props.onItemSelect}
      searchable={props.searchable ?? props.items.length > 6}
      value={props.selectedItem}
    />
  );
}
  ;

SelectPrimitive.defaultProps = {
  disabled: false,
  items: [],
  label: "",
  loading: false,
  searchable: true
};

/**
 * @template T
 * @typedef SelectObjectProps
 * @property {boolean} [disabled]
 * @property {(item: T) => string} getLabel
 * @property {(item: T) => string} [getKey]
 * @property {boolean} [hidden]
 * @property {T[]} items
 * @property {string | undefined} [label]
 * @property {boolean} [loading]
 * @property {(item: T, event?: React.SyntheticEvent<HTMLElement>) => void} onItemSelect
 * @property {boolean} [searchable]
 * @property {string | undefined} selectedItem
 */

/**
 * @type {React.FC<SelectObjectProps<any>>}
 */
export const SelectObject = props => {

  const objectItems = useMemo(() => {
    const formattedItems = {};

    props.items.forEach(item => {
      formattedItems[props.getKey ? props.getKey(item) : props.getLabel(item)] = item;
    });

    return formattedItems;

  }, [props.items]);

  return (
    <SelectPrimitive
      disabled={props.disabled}
      hidden={props.hidden}
      items={props.items.map(item => ({
        ...item,
        label: item.label || props.getLabel(item),
        value: item.value || props.getLabel(item)
      }))}
      label={props.label}
      loading={props.loading}
      onItemSelect={value => props.onItemSelect(objectItems[value])}
      searchable={props.searchable}
      selectedItem={props.selectedItem}
    />
  );
};
