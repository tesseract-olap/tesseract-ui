import {Menu, MenuItem} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {abbreviateFullName} from "../utils/format";

/**
 * @typedef OwnProps
 * @property {(item: import("../reducers/cubesReducer").JSONLevel) => boolean} isItemSelected
 * @property {(item: import("../reducers/cubesReducer").JSONLevel) => any} onItemSelected
 */

/**
 * @typedef StateProps
 * @property {import("../reducers/cubesReducer").JSONDimension[]} dimensions
 */

/** @type {React.FC<OwnProps & StateProps>} */
const DimensionsMenu = function(props) {
  const {isItemSelected, onItemSelected} = props;

  return (
    <Menu>
      {props.dimensions.map(dim => {
        let menuItems, nameFormatter;
        const hierarchies = dim.hierarchies;

        /** @param {import("../reducers/cubesReducer").JSONLevel} level */
        const levelRenderer = (level, index, levels) => (
          <MenuItem
            disabled={isItemSelected(level)}
            icon="layer"
            key={level.fullName}
            onClick={() => onItemSelected(level)}
            text={levels.length === 1 ? abbreviateFullName(level.fullName) : level.name}
          />
        );

        if (hierarchies.length === 1 && hierarchies[0].name === dim.name) {
          menuItems = hierarchies[0].levels.map(levelRenderer);
        }
        else {
          menuItems = hierarchies.map(hie => (
            <MenuItem key={hie.name} icon="layers" text={hie.name}>
              {hie.levels.map(levelRenderer)}
            </MenuItem>
          ));
        }

        return menuItems.length === 1 ? (
          menuItems[0]
        ) : (
          <MenuItem key={dim.name} icon="layers" text={dim.name}>
            {menuItems}
          </MenuItem>
        );
      })}
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

export default connect(mapStateToProps)(DimensionsMenu);
