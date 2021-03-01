import {MenuItem} from "@blueprintjs/core";
import React, {memo} from "react";
import {abbreviateFullName} from "../utils/format";
import {levelRefToArray, stringifyName} from "../utils/transform";

/**
 * @typedef OwnProps
 * @property {boolean} [childItem]
 * @property {import("@datawheel/olap-client").AdaptedDimension} dimension
 * @property {import("@datawheel/olap-client").AdaptedHierarchy} hierarchy
 * @property {import("@datawheel/olap-client").AdaptedLevel} level
 * @property {string[]} selectedItems
 * @property {(level: import("@datawheel/olap-client").AdaptedLevel, hierarchy: import("@datawheel/olap-client").AdaptedHierarchy, dimension: import("@datawheel/olap-client").AdaptedDimension) => any} onItemSelect
 */

/** @type {React.FC<OwnProps>} */
const LevelMenuItem = props => {
  const {level} = props;
  const name = props.childItem ? level.name : abbreviateFullName(levelRefToArray(level));

  return (
    <MenuItem
      disabled={props.selectedItems.includes(stringifyName(level))}
      icon="layer"
      key={level.uri}
      onClick={() => props.onItemSelect(level, props.hierarchy, props.dimension)}
      text={name}
    />
  );
};

export default memo(LevelMenuItem);
