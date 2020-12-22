import {Menu} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {selectOlapDimensionItems} from "../state/selectors";
import DimensionMenuItem from "./MenuItemDimension";

/**
 * @typedef OwnProps
 * @property {string[]} selectedItems
 * @property {(level: import("@datawheel/olap-client").AdaptedLevel, hierarchy: import("@datawheel/olap-client").AdaptedHierarchy, dimension: import("@datawheel/olap-client").AdaptedDimension) => any} onItemSelect
 */

/**
 * @typedef StateProps
 * @property {import("@datawheel/olap-client").AdaptedDimension[]} dimensions
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

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  dimensions: selectOlapDimensionItems(state) || []
});

export default connect(mapState)(DimensionMenu);
