import React from "react";
import {Menu, MenuItem} from "@blueprintjs/core";
import {connect} from "react-redux";
import memoizeOne from "memoize-one";

function TimeDimensionMenu(props) {
  const selectedItems = normalizeSelectedItems(props.selectedItems);
  const hierarchies = props.hierarchies;

  const levelRenderer = lvl => (
    <MenuItem
      key={lvl.name}
      icon="layer"
      text={lvl.name}
      disabled={selectedItems.indexOf(lvl) > -1}
      onClick={props.onClick.bind(null, lvl)}
    />
  );

  const items =
    hierarchies.length === 1
      ? hierarchies[0].levels.map(levelRenderer)
      : hierarchies.map(hie => (
          <MenuItem key={hie.name} icon="layers" text={hie.name}>
            {hie.levels.map(levelRenderer)}
          </MenuItem>
        ));

  return <Menu>{items}</Menu>;
}

function normalizeSelectedItems(selectedItems) {
  return [].concat(selectedItems).reduce((array, item) => {
    item && array.push(item.drillable);
    return array;
  }, []);
}

const getTimeDimension = memoizeOne(cube =>
  cube.dimensions.find(dim => dim.type === "time")
);

/** @param {import("../reducers").ExplorerState} state */
function mapStateToProps(state) {
  const {cube: cubeName} = state.explorerQuery;
  const cube = state.explorerCubes[cubeName];
  const timeDimension = cube && getTimeDimension(cube);
  return {
    hierarchies: timeDimension ? timeDimension.hierarchies : []
  };
}

export default connect(mapStateToProps)(TimeDimensionMenu);
