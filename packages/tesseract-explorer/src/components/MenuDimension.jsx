import {Menu} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {selectOlapDimensionItems} from "../state/selectors";
import DimensionMenuItem from "./MenuItemDimension";

/**
 * @typedef OwnProps
 * @property {string[]} selectedItems
 * @property {(level: OlapLevel, hierarchy: OlapHierarchy, dimension: OlapDimension) => any} onItemSelect
 */

/**
 * @typedef StateProps
 * @property {OlapDimension[]} dimensions
 */

/** @type {React.FC<OwnProps & StateProps>} */
const DimensionMenu = ({dimensions, selectedItems, onItemSelect}) =>
  <Menu>
    {dimensions.map(dim =>
      <DimensionMenuItem
        dimension={dim}
        key={dim.uri}
        onItemSelect={onItemSelect}
        selectedItems={selectedItems}
      />
    )}
  </Menu>;

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  dimensions: selectOlapDimensionItems(state) || []
});

export default connect(mapState)(DimensionMenu);
