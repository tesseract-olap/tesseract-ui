import React from "react";
import {Menu, MenuItem} from "@blueprintjs/core";
import {connect} from "react-redux";

function TimeDimensionMenu(props) {
  const activeItems = normalizeActiveItems(props.activeItems);
  const hierarchies = props.hierarchies;

  const levelRenderer = lvl => (
    <MenuItem
      key={lvl.name}
      icon="layer"
      text={lvl.name}
      disabled={activeItems.indexOf(lvl) > -1}
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

function normalizeActiveItems(activeItems) {
  return [].concat(activeItems).reduce((array, item) => {
    item && array.push(item.drillable);
    return array;
  }, []);
}

function mapStateToProps(state) {
  const cube = state.explorerCubes.current;
  const timeDimension = cube && cube.timeDimension;
  return {
    hierarchies: timeDimension ? timeDimension.hierarchies : []
  };
}

export default connect(mapStateToProps)(TimeDimensionMenu);
