import {MenuItem} from "@blueprintjs/core";
import memoizeOne from "memoize-one";
import React from "react";
import {connect} from "react-redux";
import GenericSelector from "./SelectorGeneric";

function itemRenderer(item, {handleClick, index, modifiers, query}) {
  return (
    <MenuItem icon="th-list" key={item} onClick={handleClick} text={item} />
  );
}

const flattenMeasures = memoizeOne(measures => measures.map(measure => measure.name));

/** @param {import("../reducers").ExplorerState} state */
function mapStateToProps(state) {
  const {cube: cubeName} = state.explorerQuery;
  const cube = state.explorerCubes[cubeName];
  return {
    itemRenderer,
    items: cube ? flattenMeasures(cube.measures) : [],
    noOptionsText: "Loading measures...",
    noSelectedText: "Measure..."
  };
}

export default connect(mapStateToProps)(GenericSelector);
