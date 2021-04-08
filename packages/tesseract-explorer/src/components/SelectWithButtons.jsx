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
        {items.map(item => <Button
          className={classNames(props.className, "select-button", {
            selected: selectedItem === item,
            unique: items.length === 1
          })}
          intent={selectedItem === item ? "primary" : undefined}
          key={item}
          onClick={evt => props.onItemSelect(item, evt)}
          text={getLabel ? getLabel(item) : item}
          title={getLabel ? getLabel(item) : item}
        />)}
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
