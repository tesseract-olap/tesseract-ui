import {Alignment, Button, Popover, Position} from "@blueprintjs/core";
import React from "react";
import {useTranslation} from "../hooks/translation";
import {ensureArray} from "../utils/array";
import TimeDimensionMenu from "./MenuTimeDimension";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {boolean} [fill]
 * @property {import("@blueprintjs/core").IconName | false} [icon]
 * @property {(level: import("@datawheel/olap-client").AdaptedLevel) => void} [onItemSelect]
 * @property {string} [placeholder]
 * @property {string | undefined} selectedItem
 * @property {boolean} [usePortal]
 */

/** @type {React.FC<OwnProps>} */
export const SelectTimeLevel = props => {
  const {translate: t} = useTranslation();

  return (
    <Popover
      autoFocus={false}
      boundary="viewport"
      className={props.className}
      content={
        <TimeDimensionMenu
          selectedItems={ensureArray(props.selectedItem)}
          onItemSelect={props.onItemSelect}
        />
      }
      fill={props.fill}
      minimal={true}
      position={Position.BOTTOM_LEFT}
      usePortal={props.usePortal}
      target={
        <Button
          alignText={Alignment.LEFT}
          fill={true}
          icon={props.icon ?? "calendar"}
          rightIcon="double-caret-vertical"
          text={props.selectedItem || t("selecttimelevel_placeholder")}
        />
      }
    >
    </Popover>
  );
};
