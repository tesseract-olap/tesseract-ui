import {Alignment, Button, Popover, Position} from "@blueprintjs/core";
import React from "react";

import DimensionMenu from "./MenuDimensions";

function LevelSelector(props) {
  const activeItem = props.activeItem;

  return (
    <Popover
      minimal={true}
      position={Position.BOTTOM_LEFT}
      targetTagName={props.fill ? "div" : props.targetTagName || "span"}
      wrapperTagName={props.fill ? "div" : props.wrapperTagName || "span"}
    >
      <Button
        alignText={Alignment.LEFT}
        fill={props.fill}
        icon={props.icon}
        rightIcon="double-caret-vertical"
        text={activeItem ? activeItem.fullName : props.placeholder}
      />
      <DimensionMenu activeItems={activeItem} onClick={props.onItemSelect} />
    </Popover>
  );
}

LevelSelector.defaultProps = {
  placeholder: "Level..."
};

export default LevelSelector;
