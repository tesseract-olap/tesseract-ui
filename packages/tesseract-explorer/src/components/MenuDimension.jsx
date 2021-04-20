import {Menu} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {selectOlapDimensionItems} from "../state/selectors";
import DimensionMenuItem from "./MenuItemDimension";

/**
 * @typedef OwnProps
 * @property {string[]} selectedItems
 * @property {(level: OlapClient.PlainLevel, hierarchy: OlapClient.PlainHierarchy, dimension: OlapClient.PlainDimension) => any} onItemSelect
 */

/**
 * @typedef StateProps
 * @property {OlapClient.PlainDimension[]} dimensions
 */

/** @type {React.FC<OwnProps & StateProps>} */
const DimensionMenu = props =>
  <Menu className="menu-dimension">
    {props.dimensions.map(dim =>
      <DimensionMenuItem
        dimension={dim}
        key={dim.uri}
        onItemSelect={props.onItemSelect}
        selectedItems={props.selectedItems}
      />
    )}
  </Menu>;

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  dimensions: selectOlapDimensionItems(state) || []
});

export default connect(mapState)(DimensionMenu);
