import {MenuItem} from "@blueprintjs/core";
import React, {memo} from "react";
import {abbreviateFullName} from "../utils/format";
import {levelRefToArray, stringifyName} from "../utils/transform";

/**
 * @typedef OwnProps
 * @property {boolean} [childItem]
 * @property {OlapLevel} level
 * @property {string[]} selectedItems
 * @property {(item: OlapLevel) => any} onItemSelect
 */

/** @type {React.FC<OwnProps>} */
const LevelMenuItem = ({childItem, level, selectedItems, onItemSelect}) => {
  const name = childItem ? level.name : abbreviateFullName(levelRefToArray(level));

  return (
    <MenuItem
      disabled={selectedItems.includes(stringifyName(level))}
      icon="layer"
      key={level.uri}
      onClick={() => onItemSelect(level)}
      text={name}
    />
  );
};

export default memo(LevelMenuItem);
