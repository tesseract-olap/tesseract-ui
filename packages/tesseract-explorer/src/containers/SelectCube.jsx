import {Alignment, Button, MenuItem} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import classNames from "classnames";
import React from "react";
import {connect} from "react-redux";
import {doCubeSet} from "../middleware/actions";
import {selectOlapCube} from "../state/selectors";
import {selectOlapCubeItems} from "../state/server/selectors";
import {safeRegExp} from "../utils/transform";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {boolean} [fill]
 * @property {string} placeholderLoading
 * @property {string} placeholderEmpty
 */

/**
 * @typedef StateProps
 * @property {import("@blueprintjs/select").ItemListPredicate<OlapCube>} itemListPredicate
 * @property {import("@blueprintjs/select").ItemRenderer<OlapCube>} itemRenderer
 * @property {OlapCube[]} items
 * @property {OlapCube | undefined} selectedItem
 */

/**
 * @typedef DispatchProps
 * @property {(cube: OlapCube) => void} onItemSelect
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const SelectCube = function(props) {
  if (props.items.length === 0) {
    return (
      <Button
        alignText={Alignment.LEFT}
        className={classNames("select-cube", props.className)}
        disabled={true}
        icon="cube"
        text={props.placeholderLoading}
      />
    );
  }

  const {selectedItem: item, fill} = props;

  return (
    <Select
      className={classNames("select-cube", props.className)}
      itemListPredicate={props.itemListPredicate}
      itemRenderer={props.itemRenderer}
      items={props.items}
      onItemSelect={props.onItemSelect}
      popoverProps={{fill, minimal: true}}
    >
      <Button
        alignText={Alignment.LEFT}
        className={props.className}
        fill={fill}
        icon="cube"
        rightIcon="double-caret-vertical"
        text={item ? item.caption || item.name : props.placeholderEmpty}
      />
    </Select>
  );
};

/** @type {import("@blueprintjs/select").ItemListPredicate<OlapCube>} */
function itemListPredicate(query, items) {
  const tester = safeRegExp(query, "i");
  return items.filter(item => tester.test(item.caption || item.name));
}

/** @type {import("@blueprintjs/select").ItemRenderer<OlapCube>} */
function itemRenderer(item, {modifiers, handleClick}) {
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      icon="cube"
      key={item.uri}
      onClick={handleClick}
      text={item.caption || item.name}
    />
  );
}

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  itemListPredicate,
  itemRenderer,
  items: selectOlapCubeItems(state),
  selectedItem: selectOlapCube(state)
});

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  onItemSelect: cube => dispatch(doCubeSet(cube.name))
});

export default connect(mapState, mapDispatch)(SelectCube);
