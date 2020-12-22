import {MenuItem} from "@blueprintjs/core";
import React, {memo} from "react";
import HierarchyMenuItem from "./MenuItemHierarchy";

/**
 * @typedef OwnProps
 * @property {import("@datawheel/olap-client").AdaptedDimension} dimension
 * @property {(level: import("@datawheel/olap-client").AdaptedLevel, hierarchy: import("@datawheel/olap-client").AdaptedHierarchy, dimension: import("@datawheel/olap-client").AdaptedDimension) => any} onItemSelect
 * @property {string[]} selectedItems
 */

/** @type {React.FC<OwnProps>} */
const DimensionMenuItem = ({dimension, selectedItems, onItemSelect}) => {
  const {hierarchies} = dimension;
  if (hierarchies.length === 1) {
    return (
      <HierarchyMenuItem
        dimension={dimension}
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
            dimension={dimension}
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
