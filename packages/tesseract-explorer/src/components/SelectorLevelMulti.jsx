import {Button, Popover} from "@blueprintjs/core";
import React, {memo} from "react";
import {stringifyName} from "../utils/transform";
import {shallowEqualExceptFns} from "../utils/validation";
import MenuDimensions from "./MenuDimension";

/**
 * @typedef OwnProps
 * @property {import("@blueprintjs/core").IconName} [icon]
 * @property {DrillableItem[]} selectedItems
 * @property {string} text
 * @property {(item: import("../structs").JSONLevel) => any} onItemSelected
 */

/** @type {React.FC<OwnProps>} */
const SelectorLevelMulti = function({selectedItems, onItemSelected, icon, text}) {
  return (
    <Popover autoFocus={false} boundary="viewport" targetTagName="div">
      <Button className="action-add" fill={true} icon={icon} small={true} text={text} />
      <MenuDimensions
        selectedItems={selectedItems.map(stringifyName)}
        onItemSelected={onItemSelected}
      />
    </Popover>
  );
};

SelectorLevelMulti.defaultProps = {
  icon: "insert"
};

export default memo(SelectorLevelMulti, shallowEqualExceptFns);
