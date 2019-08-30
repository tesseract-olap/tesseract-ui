import {Menu, MenuItem} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {abbreviateFullName} from "../utils/format";

/**
 * @typedef OwnProps
 * @property {(item: import("../reducers").JSONLevel) => boolean} isItemSelected
 * @property {(item: import("../reducers").JSONLevel) => any} onItemSelected
 */

/**
 * @typedef StateProps
 * @property {import("../reducers").JSONDimension[]} dimensions
 */

/** @type {React.FC<OwnProps & StateProps>} */
const DimensionMenu = function(props) {
  const {isItemSelected, onItemSelected} = props;

  return (
    <Menu>
      {props.dimensions.map(dim => {
        let menuItems, nameFormatter;
        const hierarchies = dim.hierarchies;

        /** @param {import("../reducers").JSONLevel} level */
        const levelRenderer = (level, index, levels) => (
          <MenuItem
            disabled={isItemSelected(level)}
            icon="layer"
            key={level.fullName}
            onClick={() => onItemSelected(level)}
            text={levels.length === 1 ? abbreviateFullName(level.fullName) : level.name}
          />
        );

        const shouldAbbreviate = hierarchies.length === 1;
        if (shouldAbbreviate && hierarchies[0].name === dim.name) {
          menuItems = hierarchies[0].levels.filter(hideMondrianAll).map(levelRenderer);
        }
        else {
          menuItems = hierarchies.map(hie => (
            <MenuItem
              key={hie.fullname}
              icon="layers"
              text={shouldAbbreviate ? abbreviateFullName(hie.fullname) : hie.name}
            >
              {hie.levels.filter(hideMondrianAll).map(levelRenderer)}
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

const hideMondrianAll = level => level.name !== "(All)";

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  const cube = state.explorerCubes[state.explorerQuery.cube];
  return {
    dimensions: cube ? cube.dimensions : []
  };
}

export default connect(mapStateToProps)(DimensionMenu);
