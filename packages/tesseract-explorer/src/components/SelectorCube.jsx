import {MenuItem} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";

import {CUBE_SELECT} from "../actions/cubes";
import GenericSelector from "./SelectorGeneric";

function itemRenderer(item, {handleClick, index, modifiers, query}) {
  return <MenuItem icon="cube" key={item.name} onClick={handleClick} text={item.name} />;
}

function mapStateToProps(state) {
  return {
    activeItem: state.explorerCubes.current,
    icon: "cube",
    itemRenderer,
    items: state.explorerCubes.available,
    noOptionsText: "Loading cubes...",
    noSelectedText: "No cube selected"
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onItemSelect: payload => dispatch({type: CUBE_SELECT, payload})
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GenericSelector);
