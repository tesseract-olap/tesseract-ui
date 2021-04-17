import {Alignment, Button, Popover, Position} from "@blueprintjs/core";
import React, {memo} from "react";
import {useTranslation} from "../hooks/translation";
import {ensureArray} from "../utils/array";
import {abbreviateFullName} from "../utils/format";
import {shallowEqualExceptFns} from "../utils/validation";
import MenuDimension from "./MenuDimension";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {boolean} [fill]
 * @property {import("@blueprintjs/core").IconName | false} [icon]
 * @property {string|undefined} [selectedItem]
 * @property {keyof JSX.IntrinsicElements} [targetTagName]
 * @property {keyof JSX.IntrinsicElements} [wrapperTagName]
 * @property {(level: import("@datawheel/olap-client").AdaptedLevel) => void} onItemSelect
 * @property {boolean} [usePortal]
 */

/** @type {React.FC<OwnProps>} */
const SelectLevel = props => {
  const {fill, icon, selectedItem} = props;
  const {translate: t} = useTranslation();

  return (
    <Popover
      autoFocus={false}
      boundary="viewport"
      className={props.className}
      minimal={true}
      position={Position.BOTTOM_LEFT}
      fill={fill}
      usePortal={props.usePortal}
    >
      <Button
        alignText={Alignment.LEFT}
        fill={fill}
        icon={icon}
        rightIcon="double-caret-vertical"
        text={selectedItem ? abbreviateFullName(selectedItem) : t("selectlevel_placeholder")}
      />
      <MenuDimension
        selectedItems={ensureArray(selectedItem)}
        onItemSelect={props.onItemSelect}
      />
    </Popover>
  );
};

SelectLevel.defaultProps = {
  icon: "layer"
};

export default memo(SelectLevel, shallowEqualExceptFns);
