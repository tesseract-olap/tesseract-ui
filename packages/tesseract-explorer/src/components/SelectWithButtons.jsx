import {Button, ButtonGroup} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import {SelectObject, SelectPrimitive} from "./Select";

/**
 * @template T
 * @typedef OwnProps
 * @property {T[]} items
 * @property {(item: T, event?: React.SyntheticEvent<HTMLElement, Event> | undefined) => void} onItemSelect
 * @property {T} selectedItem
 * @property {string} [text]
 * @property {string} [className]
 * @property {boolean} [fill]
 * @property {(item: T) => string} [getLabel]
 * @property {boolean} [hidden]
 */

/** @type {React.FC<OwnProps<any>>} */
export const SelectWithButtons = props => {
  const {items, selectedItem, fill = true, getLabel} = props;

  if (props.hidden || items.length === 0 || !selectedItem) {
    return null;
  }

  if (items.length < 4) {
    return (
      <ButtonGroup fill className={classNames(props.className, "as-buttons")}>
        {items.map(item => {
          const label = getLabel ? getLabel(item) : item;
          return (
            <Button
              className={classNames(props.className, "select-button", {
                selected: selectedItem === item,
                unique: items.length === 1
              })}
              intent={selectedItem === item ? "primary" : undefined}
              key={label}
              onClick={evt => props.onItemSelect(item, evt)}
              text={label}
              title={label}
            />
          );
        })}
      </ButtonGroup>
    );
  }

  if (getLabel) {
    return (
      <SelectObject
        className={props.className}
        fill={fill}
        getLabel={getLabel}
        items={items}
        onItemSelect={props.onItemSelect}
        selectedItem={props.text || getLabel(selectedItem)}
      />
    );
  }

  return (
    <SelectPrimitive
      className={props.className}
      fill={fill}
      items={items}
      onItemSelect={props.onItemSelect}
      selectedItem={props.text || selectedItem}
    />
  );
};
