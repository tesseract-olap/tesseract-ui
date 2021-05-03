import {MenuItem} from "@blueprintjs/core";
import React, {memo} from "react";
import {abbreviateFullName} from "../utils/format";
import {levelRefToArray, stringifyName} from "../utils/transform";

/**
 * @typedef OwnProps
 * @property {boolean} [childItem]
 * @property {OlapClient.PlainDimension} dimension
 * @property {OlapClient.PlainHierarchy} hierarchy
 * @property {OlapClient.PlainLevel} level
 * @property {string[]} selectedItems
 * @property {(level: OlapClient.PlainLevel, hierarchy: OlapClient.PlainHierarchy, dimension: OlapClient.PlainDimension) => any} onItemSelect
 */

/** @type {React.FC<OwnProps>} */
export const LevelMenuItem = props => {
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

export const MemoLevelMenuItem = memo(LevelMenuItem);
