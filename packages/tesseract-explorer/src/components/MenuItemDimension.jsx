import {MenuItem} from "@blueprintjs/core";
import React, {memo} from "react";
import HierarchyMenuItem from "./MenuItemHierarchy";

/**
 * @typedef OwnProps
 * @property {import("../reducers").JSONDimension} dimension
 * @property {(item: import("../reducers").JSONLevel) => any} onItemSelected
 * @property {string[]} selectedItems
 */

/** @type {React.FC<OwnProps>} */
const DimensionMenuItem = function({dimension, selectedItems, onItemSelected}) {
  const {hierarchies} = dimension;
  if (hierarchies.length === 1) {
    return (
      <HierarchyMenuItem
        hierarchy={hierarchies[0]}
        key={hierarchies[0].uri}
        onItemSelected={onItemSelected}
        selectedItems={selectedItems}
      />
    );
  }
  else {
    return (
      <MenuItem key={dimension.uri} icon="layers" text={dimension.name}>
        {hierarchies.map(hie => (
          <HierarchyMenuItem
            childItem
            hierarchy={hie}
            key={hie.uri}
            onItemSelected={onItemSelected}
            selectedItems={selectedItems}
          />
        ))}
      </MenuItem>
    );
  }
};

export default memo(DimensionMenuItem);
