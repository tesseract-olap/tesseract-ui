import {MenuItem} from "@blueprintjs/core";
import React, {memo} from "react";
import {abbreviateFullName} from "../utils/format";
import {levelRefToArray, stringifyName} from "../utils/transform";

/**
 * @typedef OwnProps
 * @property {boolean} [childItem]
 * @property {OlapDimension} dimension
 * @property {OlapHierarchy} hierarchy
 * @property {OlapLevel} level
 * @property {string[]} selectedItems
 * @property {(level: OlapLevel, hierarchy: OlapHierarchy, dimension: OlapDimension) => any} onItemSelect
 */

/** @type {React.FC<OwnProps>} */
const LevelMenuItem = ({
  childItem,
  dimension,
  hierarchy,
  level,
  selectedItems,
  onItemSelect
}) => {
  const name = childItem ? level.name : abbreviateFullName(levelRefToArray(level));

  return (
    <MenuItem
      disabled={selectedItems.includes(stringifyName(level))}
      icon="layer"
      key={level.uri}
      onClick={() => onItemSelect(level, hierarchy, dimension)}
      text={name}
    />
  );
};

export default memo(LevelMenuItem);
