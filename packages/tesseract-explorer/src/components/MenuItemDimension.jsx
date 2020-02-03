import {MenuItem} from "@blueprintjs/core";
import React, {memo} from "react";
import HierarchyMenuItem from "./MenuItemHierarchy";

/**
 * @typedef OwnProps
 * @property {OlapDimension} dimension
 * @property {(item: OlapLevel) => any} onItemSelect
 * @property {string[]} selectedItems
 */

/** @type {React.FC<OwnProps>} */
const DimensionMenuItem = ({dimension, selectedItems, onItemSelect}) => {
  const {hierarchies} = dimension;
  if (hierarchies.length === 1) {
    return (
      <HierarchyMenuItem
        hierarchy={hierarchies[0]}
        key={hierarchies[0].uri}
        onItemSelect={onItemSelect}
        selectedItems={selectedItems}
      />
    );
  }
  else {
    return (
      <MenuItem key={dimension.uri} icon="layers" text={dimension.name}>
        {hierarchies.map(hie =>
          <HierarchyMenuItem
            childItem
            hierarchy={hie}
            key={hie.uri}
            onItemSelect={onItemSelect}
            selectedItems={selectedItems}
          />
        )}
      </MenuItem>
    );
  }
};

export default memo(DimensionMenuItem);
