import {MenuItem} from "@blueprintjs/core";
import React, {memo} from "react";
import {abbreviateFullName} from "../utils/format";
import {stringifyName} from "../utils/transform";

/**
 * @typedef OwnProps
 * @property {boolean} [childItem]
 * @property {import("../reducers").JSONLevel} level
 * @property {string[]} selectedItems
 * @property {(item: import("../reducers").JSONLevel) => any} onItemSelected
 */

/** @type {React.FC<OwnProps>} */
const LevelMenuItem = function({childItem, level, selectedItems, onItemSelected}) {
  const name = childItem ? level.name : abbreviateFullName([level.hierarchy, level.name]);

  return (
    <MenuItem
      disabled={selectedItems.includes(stringifyName(level))}
      icon="layer"
      key={level.uri}
      onClick={() => onItemSelected(level)}
      text={name}
    />
  );
};

export default memo(LevelMenuItem);
