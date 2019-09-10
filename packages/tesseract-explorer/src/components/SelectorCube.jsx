import {MenuItem} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {setCube} from "../actions/client";
import GenericSelector from "./SelectorGeneric";

/**
 * @typedef OwnProps
 * @property {string} noOptionsText
 * @property {string} noSelectedText
 */

/**
 * @typedef StateProps
 * @property {string} selectedItem
 * @property {import("@blueprintjs/core").IconName} icon
 * @property {(item: string, {handleClick, index, modifiers, query}) => JSX.Element} itemRenderer
 * @property {string[]} items
 */

/**
 * @typedef DispatchProps
 * @property {(cubeName: string) => void} onItemSelect
 */

/** @type {(item: string, {handleClick, index, modifiers, query}) => JSX.Element} */
function itemRenderer(item, {handleClick}) {
  return <MenuItem icon="cube" key={item} onClick={handleClick} text={item} />;
}

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, import("../reducers").ExplorerState>} */
function mapStateToProps(state) {
  return {
    selectedItem: state.explorerQuery.cube,
    icon: "cube",
    itemRenderer,
    items: Object.keys(state.explorerCubes)
  };
}

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
function mapDispatchToProps(dispatch) {
  return {
    onItemSelect: cubeName => dispatch(setCube(cubeName))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GenericSelector);
