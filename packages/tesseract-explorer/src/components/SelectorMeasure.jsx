import {MenuItem} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";

import GenericSelector from "./SelectorGeneric";

function itemRenderer(item, {handleClick, index, modifiers, query}) {
  return (
    <MenuItem icon="th-list" key={item.name} onClick={handleClick} text={item.name} />
  );
}

/** @param {import("../reducers").ExplorerState} state */
function mapStateToProps(state) {
  const cube = state.explorerCubes.current;
  return {
    itemRenderer,
    items: cube ? cube.measures : [],
    noOptionsText: "Loading measures...",
    noSelectedText: "Measure..."
  };
}

export default connect(mapStateToProps)(GenericSelector);
