import {Menu} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import DimensionMenuItem from "./MenuItemDimension";

/**
 * @typedef OwnProps
 * @property {string[]} selectedItems
 * @property {(item: import("../reducers").JSONLevel) => any} onItemSelected
 */

/**
 * @typedef StateProps
 * @property {import("../reducers").JSONDimension[]} dimensions
 */

/** @type {React.FC<OwnProps & StateProps>} */
const DimensionMenu = function({dimensions, selectedItems, onItemSelected}) {
  return (
    <Menu>
      {dimensions.map(dim => (
        <DimensionMenuItem
          dimension={dim}
          key={dim.uri}
          onItemSelected={onItemSelected}
          selectedItems={selectedItems}
        />
      ))}
    </Menu>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  const cube = state.explorerCubes[state.explorerQuery.cube];
  return {
    dimensions: cube ? cube.dimensions : []
  };
}

export default connect(mapStateToProps)(DimensionMenu);
