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
 * @property {boolean} [hideIfEmpty]
 * @property {string} placeholderLoading
 * @property {string} placeholderEmpty
 */

/**
 * @typedef StateProps
 * @property {import("@blueprintjs/select").ItemListPredicate<import("@datawheel/olap-client").AdaptedCube>} itemListPredicate
 * @property {import("@blueprintjs/select").ItemRenderer<import("@datawheel/olap-client").AdaptedCube>} itemRenderer
 * @property {import("@datawheel/olap-client").AdaptedCube[]} items
 * @property {import("@datawheel/olap-client").AdaptedCube} [selectedItem]
 */

/**
 * @typedef DispatchProps
 * @property {(cube: import("@datawheel/olap-client").AdaptedCube) => void} onItemSelect
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
export const SelectCube = props => {
  if (props.items.length < 2) {
    return props.hideIfEmpty
      ? null
      : <Button
        alignText={Alignment.LEFT}
        className={classNames("select-cube", props.className)}
        disabled={true}
        icon="cube"
        text={props.placeholderLoading}
      />;
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

/** @type {import("@blueprintjs/select").ItemListPredicate<import("@datawheel/olap-client").AdaptedCube>} */
function itemListPredicate(query, items) {
  const tester = safeRegExp(query, "i");
  return items.filter(item => tester.test(item.caption || item.name));
}

/** @type {import("@blueprintjs/select").ItemRenderer<import("@datawheel/olap-client").AdaptedCube>} */
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

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  itemListPredicate,
  itemRenderer,
  items: selectOlapCubeItems(state),
  selectedItem: selectOlapCube(state)
});

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  onItemSelect: cube => dispatch(doCubeSet(cube.name))
});

export const ConnectedSelectCube = connect(mapState, mapDispatch)(SelectCube);
