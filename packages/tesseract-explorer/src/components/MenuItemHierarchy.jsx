import {MenuItem} from "@blueprintjs/core";
import React, {memo} from "react";
import {abbreviateFullName} from "../utils/format";
import LevelMenuItem from "./MenuItemLevel";
import {removeFromArray} from "../utils/array";

/**
 * @typedef OwnProps
 * @property {boolean} [childItem]
 * @property {import("../reducers").JSONHierarchy} hierarchy
 * @property {(item: import("../reducers").JSONLevel) => any} onItemSelected
 * @property {string[]} selectedItems
 */

/** @type {React.FC<OwnProps>} */
const HierarchyMenuItem = function({
  childItem,
  hierarchy,
  onItemSelected,
  selectedItems
}) {
  const {levels} = hierarchy;
  const name = childItem
    ? hierarchy.name
    : abbreviateFullName([hierarchy.dimension, hierarchy.name]);

  if (levels.length === 1) {
    return (
      <LevelMenuItem
        key={levels[0].uri}
        level={levels[0]}
        onItemSelected={onItemSelected}
        selectedItems={selectedItems}
      />
    );
  }
  else {
    return (
      <MenuItem key={hierarchy.uri} icon="layers" text={name}>
        {levels.map(lvl => (
          <LevelMenuItem
            childItem
            key={lvl.uri}
            level={lvl}
            onItemSelected={onItemSelected}
            selectedItems={selectedItems}
          />
        ))}
      </MenuItem>
    );
  }
};

export default memo(HierarchyMenuItem);
