import {Menu} from "@blueprintjs/core";
import React, {memo} from "react";
import {connect} from "react-redux";
import {shallowEqualExceptFns} from "../utils/validation";
import HierarchyMenuItem from "./MenuItemHierarchy";

/**
 * @typedef OwnProps
 * @property {string[]} [selectedItems]
 * @property {(level: import("../reducers").JSONLevel) => any} onClick
 */

/**
 * @typedef StateProps
 * @property {import("../reducers").JSONHierarchy[]} hierarchies
 */

/** @type {React.FC<OwnProps & StateProps>} */
const TimeDimensionMenu = function({hierarchies, onClick, selectedItems}) {
  return (
    <Menu>
      {hierarchies.map(hie => (
        <HierarchyMenuItem
          hierarchy={hie}
          key={hie.uri}
          onItemSelected={onClick}
          selectedItems={selectedItems}
        />
      ))}
    </Menu>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  const {cube: cubeName} = state.explorerQuery;
  const cube = state.explorerCubes[cubeName];
  const timeDimension = cube && cube.dimensions.find(dim => dim.dimensionType === "time");
  return {
    hierarchies: timeDimension ? timeDimension.hierarchies : []
  };
}

export default connect(mapStateToProps)(memo(TimeDimensionMenu, shallowEqualExceptFns));
