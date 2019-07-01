import React from "react";
import {Menu, MenuItem} from "@blueprintjs/core";
import {connect} from "react-redux";

function DimensionsMenu(props) {
  const activeItems = normalizeActiveItems(props.activeItems);
  const levelRenderer = lvl => (
    <MenuItem
      key={lvl.name}
      icon="layer"
      text={lvl.name}
      disabled={activeItems.indexOf(lvl) > -1}
      onClick={props.onClick.bind(null, lvl)}
    />
  );
  return (
    <Menu>
      {props.dimensions.map(dim => {
        let menuItems;

        const hierarchies = dim.hierarchies;
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

        return (
          <MenuItem key={dim.name} icon="layers" text={dim.name}>
            {menuItems}
          </MenuItem>
        );
      })}
    </Menu>
  );
}

function normalizeActiveItems(activeItems) {
  return [].concat(activeItems).reduce((array, item) => {
    item && array.push(item.drillable);
    return array;
  }, []);
}

/** @param {import("../reducers").ExplorerState} state */
function mapStateToProps(state) {
  return {
    dimensions: state.explorerCubes.current ? state.explorerCubes.current.dimensions : []
  };
}

export default connect(mapStateToProps)(DimensionsMenu);
