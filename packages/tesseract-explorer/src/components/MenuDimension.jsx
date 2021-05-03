import {Menu} from "@blueprintjs/core";
import React from "react";
import {useSelector} from "react-redux";
import {selectOlapDimensionItems} from "../state/selectors";
import {MemoDimensionMenuItem as DimensionMenuItem} from "./MenuItemDimension";

/**
 * @typedef OwnProps
 * @property {string[]} selectedItems
 * @property {(level: OlapClient.PlainLevel, hierarchy: OlapClient.PlainHierarchy, dimension: OlapClient.PlainDimension) => any} onItemSelect
 */

/** @type {React.FC<OwnProps>} */
export const DimensionMenu = props => {
  const dimensions = useSelector(selectOlapDimensionItems) || [];

  return (
    <Menu className="menu-dimension">
      {dimensions.map(dim =>
        <DimensionMenuItem
          dimension={dim}
          key={dim.uri}
          onItemSelect={props.onItemSelect}
          selectedItems={props.selectedItems}
        />
      )}
    </Menu>
  );
};
