import {MenuItem} from "@blueprintjs/core";
import React, {memo} from "react";
import {abbreviateFullName} from "../utils/format";
import {MemoLevelMenuItem as LevelMenuItem} from "./MenuItemLevel";

/**
 * @typedef OwnProps
 * @property {boolean} [childItem]
 * @property {OlapClient.PlainDimension} dimension
 * @property {OlapClient.PlainHierarchy} hierarchy
 * @property {(level: OlapClient.PlainLevel, hierarchy: OlapClient.PlainHierarchy, dimension: OlapClient.PlainDimension) => any} onItemSelect
 * @property {string[]} selectedItems
 */

/** @type {React.FC<OwnProps>} */
export const HierarchyMenuItem = props => {
  const {hierarchy} = props;
  const {levels} = hierarchy;
  const name = props.childItem
    ? hierarchy.name
    : abbreviateFullName([hierarchy.dimension, hierarchy.name]);

  if (levels.length === 1) {
    return (
      <LevelMenuItem
        dimension={props.dimension}
        hierarchy={hierarchy}
        key={levels[0].uri}
        level={levels[0]}
        onItemSelect={props.onItemSelect}
        selectedItems={props.selectedItems}
      />
    );
  }

  const {dimension, onItemSelect, selectedItems} = props;
  return (
    <MenuItem key={hierarchy.uri} icon="layers" text={name}>
      {levels.map(lvl =>
        <LevelMenuItem
          childItem
          dimension={dimension}
          hierarchy={hierarchy}
          key={lvl.uri}
          level={lvl}
          onItemSelect={onItemSelect}
          selectedItems={selectedItems}
        />
      )}
    </MenuItem>
  );
};

export const MemoHierarchyMenuItem = memo(HierarchyMenuItem);
