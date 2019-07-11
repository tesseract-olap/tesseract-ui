import {Button, Popover} from "@blueprintjs/core";
import React from "react";
import DimensionsMenu from "./MenuDimensions";

/**
 * @typedef OwnProps
 * @property {import("@blueprintjs/core").IconName} [icon]
 * @property {import("../reducers").DrillableItem[]} selectedItems
 * @property {string} text
 * @property {(item: import("../reducers/cubesReducer").JSONLevel) => any} onItemSelected
 */

/** @type {React.FC<OwnProps>} */
const SelectorLevelMulti = function(props) {
  const selectedItems = props.selectedItems.map(item => item.drillable);
  return (
    <Popover autoFocus={false} boundary="viewport" targetTagName="div">
      <Button
        className="action-add"
        fill={true}
        icon={props.icon}
        small={true}
        text={props.text}
      />
      <DimensionsMenu
        isItemSelected={item => selectedItems.includes(item.fullName)}
        onItemSelected={props.onItemSelected}
      />
    </Popover>
  );
};

SelectorLevelMulti.defaultProps = {
  icon: "insert"
};

export default SelectorLevelMulti;
