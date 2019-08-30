import React, {memo} from "react";
import {Menu, MenuItem} from "@blueprintjs/core";
import {connect} from "react-redux";
import memoizeOne from "memoize-one";

/**
 * @typedef OwnProps
 * @property {import("../reducers").DrillableItem[]} selectedItems
 * @property {(level: JSONLevel) => any} onClick
 */

/**
 * @typedef StateProps
 * @property {import("../reducers/cubesReducer").JSONHierarchy[]} hierarchies
 */

/** @type {React.FC<OwnProps & StateProps>} */
const TimeDimensionMenu = memo(function(props) {
  const selectedItems = [].concat(props.selectedItems).reduce((array, item) => {
    item && array.push(item.drillable);
    return array;
  }, []);
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
});

const getTimeDimension = memoizeOne(cube =>
  cube.dimensions.find(dim => dim.type === "time")
);

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  const {cube: cubeName} = state.explorerQuery;
  const cube = state.explorerCubes[cubeName];
  const timeDimension = cube && getTimeDimension(cube);
  return {
    hierarchies: timeDimension ? timeDimension.hierarchies : []
  };
}

export default connect(mapStateToProps)(TimeDimensionMenu);
