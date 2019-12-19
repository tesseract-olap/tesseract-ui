import {MenuItem} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {selectMeasureNameList} from "../selectors/cubes";
import GenericSelector from "./SelectorGeneric";

function itemRenderer(item, {handleClick, index, modifiers, query}) {
  return <MenuItem icon="th-list" key={item} onClick={handleClick} text={item} />;
}

/** @param {ExplorerState} state */
function mapStateToProps(state) {
  return {
    itemRenderer,
    items: selectMeasureNameList(state) || [],
    noOptionsText: "Loading measures...",
    noSelectedText: "Measure..."
  };
}

export default connect(mapStateToProps)(GenericSelector);
