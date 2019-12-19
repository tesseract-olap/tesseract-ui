import {MenuItem} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {setCube} from "../middleware/actions";
import {selectCubeNameList} from "../selectors/cubes";
import {safeRegExp} from "../utils/transform";
import GenericSelector from "./SelectorGeneric";

/**
 * @typedef OwnProps
 * @property {string} noOptionsText
 * @property {string} noSelectedText
 */

/**
 * @typedef StateProps
 * @property {import("@blueprintjs/core").IconName} icon
 * @property {import("@blueprintjs/select").ItemListPredicate<string>} itemListPredicate
 * @property {import("@blueprintjs/select").ItemRenderer<string>} itemRenderer
 * @property {string[]} items
 * @property {string} selectedItem
 */

/**
 * @typedef DispatchProps
 * @property {(cubeName: string) => void} onItemSelect
 */

/** @type {import("@blueprintjs/select").ItemRenderer<string>} */
function itemRenderer(item, {handleClick}) {
  return <MenuItem icon="cube" key={item} onClick={handleClick} text={item} />;
}

/** @type {import("@blueprintjs/select").ItemListPredicate<string>} */
function itemListPredicate(query, items) {
  const tester = safeRegExp(query, "i");
  return items.filter(item => tester.test(item));
}

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
function mapStateToProps(state) {
  return {
    icon: "cube",
    itemListPredicate,
    itemRenderer,
    items: selectCubeNameList(state),
    selectedItem: state.explorerQuery.cube
  };
}

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
function mapDispatchToProps(dispatch) {
  return {
    onItemSelect: cubeName => dispatch(setCube(cubeName))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GenericSelector);
