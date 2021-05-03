import {MenuItem} from "@blueprintjs/core";
import React, {memo} from "react";
import {MemoHierarchyMenuItem as HierarchyMenuItem} from "./MenuItemHierarchy";

/**
 * @typedef OwnProps
 * @property {OlapClient.PlainDimension} dimension
 * @property {(level: OlapClient.PlainLevel, hierarchy: OlapClient.PlainHierarchy, dimension: OlapClient.PlainDimension) => any} onItemSelect
 * @property {string[]} selectedItems
 */

/** @type {React.FC<OwnProps>} */
export const DimensionMenuItem = props => {
  const {dimension} = props;
  const {hierarchies} = dimension;

  if (hierarchies.length === 1) {
    return (
      <HierarchyMenuItem
        dimension={dimension}
        hierarchy={hierarchies[0]}
        key={hierarchies[0].uri}
        onItemSelect={props.onItemSelect}
        selectedItems={props.selectedItems}
      />
    );
  }

  return (
    <MenuItem key={dimension.uri} icon="layers" text={dimension.name}>
      {hierarchies.map(hie =>
        <HierarchyMenuItem
          childItem
          dimension={dimension}
          hierarchy={hie}
          key={hie.uri}
          onItemSelect={props.onItemSelect}
          selectedItems={props.selectedItems}
        />
      )}
    </MenuItem>
  );
};

export const MemoDimensionMenuItem = memo(DimensionMenuItem);
