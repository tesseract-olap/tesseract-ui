import {Button, Classes, InputGroup, Menu, MenuDivider, MenuItem, Tag} from "@blueprintjs/core";
import classNames from "classnames";
import React, {useCallback, useMemo, useState} from "react";
import ViewPortList from "react-viewport-list";
import {useTranslation} from "../hooks/translation";
import {keyBy, safeRegExp} from "../utils/transform";

/**
 * @template {TessExpl.Struct.IQueryItem} T
 * @typedef OwnProps
 * @property {Record<string, T>} items
 * @property {T["key"][]} activeItems
 * @property {(items: T["key"][]) => void} onChange
 * @property {(item: T) => string} getLabel
 * @property {(item: T) => string | undefined} [getSecondLabel]
 * @property {ItemPredicateFunction<T> | {label: string; method: ItemPredicateFunction<T>}[]} [itemPredicate]
 */

/**
 * @template {TessExpl.Struct.IQueryItem} T
 * @type {React.FC<OwnProps<T>>}
 */
export const TransferInput = props => {
  const {activeItems, getLabel, items, itemPredicate, onChange} = props;
  const sideLabelRenderer = props.getSecondLabel || (() => undefined);

  const {translate: t} = useTranslation();

  const [filter, setFilter] = useState("");
  const [itemPredicateIndex, setItemPredicateIndex] = useState(0);

  const activeKeys = useMemo(
    () => keyBy(activeItems, key => key),
    [activeItems]
  );

  const results = useMemo(() => {
    const selected = [];
    const unselected = [];

    // If the user filters using a comma-separated list of words/numbers,
    // consider the commas as RegExp `|`
    const commaSeparated = /^[\s0-9A-Za-z,]+$/;
    const tester = commaSeparated.test(filter)
      ? safeRegExp(filter.replace(/,/g, "|"), "i")
      : safeRegExp(filter, "i");

    // If multiple options were provided, pick according to stored index
    // Else use unique option directly. Define a fallback if anything went wrong.
    /** @type {ItemPredicateFunction<T>} */
    const currentPredicate = (
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
      activeKeys.hasOwnProperty(key)
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
    const resetButton = filter.length > 0 ? (
      <Button minimal icon="cross" onClick={() => setFilter("")} />
    ) : undefined;

    if (Array.isArray(itemPredicate)) {
      const currentPredicate = itemPredicate[itemPredicateIndex];
      const pickNextPredicate = () => {
        const nextIndex = itemPredicateIndex + 1;
        setItemPredicateIndex(nextIndex >= itemPredicate.length ? 0 : nextIndex);
      };
      return (
        <div style={{display: "flex"}}>
          <Tag minimal interactive round icon="search-template" onClick={pickNextPredicate}>
            {currentPredicate.label}
          </Tag>
          {resetButton}
        </div>
      );
    };

    return resetButton;
  }, [filter.length > 0, itemPredicateIndex]);

  /** @type {(item: T, index: number) => JSX.Element} */
  const renderItem = item => <MenuItem
    icon={activeKeys.hasOwnProperty(item.key) ? "tick-circle" : undefined}
    key={item.key}
    labelElement={sideLabelRenderer(item)}
    onClick={toggleHandler.bind(null, item)}
    shouldDismissPopover={false}
    text={getLabel(item)}
  />;

  return (
    <div className="input-transfer">
      <InputGroup
        className="item-filter"
        leftIcon="search"
        onChange={evt => setFilter(evt.target.value)}
        placeholder={t("transfer_input.search_placeholder")}
        rightElement={rightElement}
        type="search"
        value={filter}
      />
      <Menu className={classNames("item-list", Classes.ELEVATION_0)}>
        {unselectedHidden > 0 &&
          <MenuDivider title={t("transfer_input.count_hidden", {n: unselectedHidden})} />
        }
        <ViewPortList items={results.unselected} itemMinSize={30}>
          {renderItem}
        </ViewPortList>
      </Menu>
      <Menu className={classNames("item-list", Classes.ELEVATION_0)}>
        {selectedHidden > 0 &&
          <MenuDivider title={t("transfer_input.count_hidden", {n: selectedHidden})} />
        }
        <ViewPortList items={results.selected} itemMinSize={30}>
          {renderItem}
        </ViewPortList>
      </Menu>
      <Button
        rightIcon="double-chevron-right"
        text={filter ? t("transfer_input.select_filtered") : t("transfer_input.select_all")}
        onClick={selectAllHandler}
      />
      <Button
        icon="double-chevron-left"
        text={filter ? t("transfer_input.unselect_filtered") : t("transfer_input.unselect_all")}
        onClick={unselectAllHandler}
      />
    </div>
  );
};

TransferInput.defaultProps = {
  getLabel: item => `${item}`
};

/**
 * @template {TessExpl.Struct.IQueryItem} T
 * @typedef {(query: RegExp, item: T, index: number) => boolean} ItemPredicateFunction
 */
