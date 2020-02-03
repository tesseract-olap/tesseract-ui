import {MenuItem} from "@blueprintjs/core";
import React, {memo} from "react";
import {abbreviateFullName} from "../utils/format";
import LevelMenuItem from "./MenuItemLevel";

/**
 * @typedef OwnProps
 * @property {boolean} [childItem]
 * @property {OlapHierarchy} hierarchy
 * @property {(item: OlapLevel) => any} onItemSelect
 * @property {string[]} selectedItems
 */

/** @type {React.FC<OwnProps>} */
const HierarchyMenuItem = ({
  childItem,
  hierarchy,
  onItemSelect,
  selectedItems
}) => {
  const {levels} = hierarchy;
  const name = childItem
    ? hierarchy.name
    : abbreviateFullName([hierarchy.dimension, hierarchy.name]);

  if (levels.length === 1) {
    return (
      <LevelMenuItem
        key={levels[0].uri}
        level={levels[0]}
        onItemSelect={onItemSelect}
        selectedItems={selectedItems}
      />
    );
  }
  else {
    return (
      <MenuItem key={hierarchy.uri} icon="layers" text={name}>
        {levels.map(lvl =>
          <LevelMenuItem
            childItem
            key={lvl.uri}
            level={lvl}
            onItemSelect={onItemSelect}
            selectedItems={selectedItems}
          />
        )}
      </MenuItem>
    );
  }
};

export default memo(HierarchyMenuItem);
