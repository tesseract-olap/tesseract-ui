import {MenuItem} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {setCube} from "../actions/client";
import GenericSelector from "./SelectorGeneric";

function itemRenderer(item, {handleClick, index, modifiers, query}) {
  return <MenuItem icon="cube" key={item} onClick={handleClick} text={item} />;
}

/** @param {import("../reducers").ExplorerState} state */
function mapStateToProps(state) {
  return {
    selectedItem: state.explorerQuery.cube,
    icon: "cube",
    itemRenderer,
    items: state.explorerCubes._all
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onItemSelect: cubeName => dispatch(setCube(cubeName))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GenericSelector);
