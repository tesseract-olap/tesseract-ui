import {Button, Classes, InputGroup, Menu, MenuItem} from "@blueprintjs/core";
import classNames from "classnames";
import React, {useMemo, useState} from "react";
import ViewPortList from "react-viewport-list";
import {safeRegExp} from "../utils/transform";
import {activeItemCounter} from "../utils/validation";

import "../style/TransferInput.scss";

/**
 * @template T
 * @typedef OwnProps
 * @property {T[]} items
 * @property {(items: T[]) => void} onChange
 * @property {(item: T) => string} [getLabel]
 * @property {string} [searchPlaceholder]
 */

/**
 * @template {TessExpl.Struct.IQueryItem} T
 * @type {React.FC<OwnProps<T>>}
 */
export const TransferInput = ({
  items,
  onChange,
  getLabel = item => `${item}`,
  searchPlaceholder = "Filter items (supports regex)"
}) => {
  const [filter, setFilter] = useState("");

  const toggleHandler = (item, idx = items.indexOf(item), key = item.key) => {
    const index = idx > -1 ? idx : items.findIndex(itm => itm.key === key);
    const nextItems = items.slice();
    nextItems[index] = {...item, active: !item.active};
    onChange(nextItems);
  };

  const {selected, unselected} = useMemo(() => {
    const selected = items.slice(0, 0);
    const unselected = items.slice(0, 0);
    const tester = safeRegExp(filter, "i");
    let i = items.length;
    while (i--) {
      const item = items[i];
      tester.test(getLabel(item)) &&
        (item.active ? selected : unselected).unshift(item);
    }
    return {selected, unselected};
  }, [items, filter]);

  const selectedCount = items.reduce(activeItemCounter, 0);
  const selectedHidden = selectedCount - selected.length;

  const unselectedCount = items.length - selectedCount;
  const unselectedHidden = unselectedCount - unselected.length;

  const rightElement = filter.length > 0
    ? <Button icon="cross" minimal={true} onClick={() => setFilter("")} />
    : undefined;

  /** @type {(item: T, index: number) => JSX.Element} */
  const renderItem = item => <MenuItem
    icon={item.active ? "tick-circle" : undefined}
    key={item.key}
    onClick={() => toggleHandler(item)}
    shouldDismissPopover={false}
    text={getLabel(item)}
  />;

  return (
    <div className="input-transfer">
      <InputGroup
        className="item-filter"
        leftIcon="search"
        onChange={evt => setFilter(evt.target.value)}
        placeholder={searchPlaceholder}
        rightElement={rightElement}
        type="search"
        value={filter}
      />
      <Menu className={classNames("item-list", Classes.ELEVATION_0)}>
        <React.Fragment>
          {unselectedHidden > 0 &&
          <Menu.Divider title={`${unselectedHidden} items hidden`} />
          }
          <ViewPortList items={unselected.slice(0, 1000)} itemMinSize={30}>
            {renderItem}
          </ViewPortList>
        </React.Fragment>
      </Menu>
      <Menu className={classNames("item-list", Classes.ELEVATION_0)}>
        <React.Fragment>
          {selectedHidden > 0 &&
            <Menu.Divider title={`${selectedHidden} items hidden`} />
          }
          <ViewPortList items={selected.slice(0, 1000)} itemMinSize={30}>
            {renderItem}
          </ViewPortList>
        </React.Fragment>
      </Menu>
    </div>
  );
};
