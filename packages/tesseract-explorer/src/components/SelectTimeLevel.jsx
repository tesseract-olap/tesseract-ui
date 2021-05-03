import React from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {selectOlapTimeDimension} from "../state/selectors";
import {ensureArray} from "../utils/array";
import {abbreviateFullName} from "../utils/format";
import {DimensionMenuItem} from "./MenuItemDimension";
import {SelectObject} from "./Select";

/** @type {React.FC<import("./Select").SelectObjectProps<OlapClient.PlainLevel>>} */
const SelectTimeDimension = SelectObject;

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {boolean} [fill]
 * @property {BlueprintCore.IconName | false} [icon]
 * @property {(level: OlapClient.PlainLevel) => void} onItemSelect
 * @property {string | undefined} selectedItem
 */

/** @type {React.FC<OwnProps>} */
export const SelectTimeLevel = props => {
  const {translate: t} = useTranslation();

  const timeDimension = useSelector(selectOlapTimeDimension);

  if (!timeDimension) {
    return null;
  }

  /** @type {(itemListProps: import("@blueprintjs/select").IItemListRendererProps<OlapClient.PlainLevel>) => JSX.Element | null} */
  const listRenderer = itemListProps => {
    const {} = itemListProps;
    return (
      <DimensionMenuItem
        dimension={timeDimension}
        onItemSelect={props.onItemSelect}
        selectedItems={ensureArray(props.selectedItem)}
      />
    );
  };

  return (
    <SelectTimeDimension
      className={props.className}
      itemListRenderer={listRenderer}
      fill={props.fill}
      items={[]}
      getLabel={item => item.uniqueName || abbreviateFullName([item.dimension, item.hierarchy, item.name])}
      onItemSelect={props.onItemSelect}
      icon={props.icon ?? "calendar"}
      selectedItem={props.selectedItem || t("selecttimelevel_placeholder")}
    />
  );
};
