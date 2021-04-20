import React, {Fragment, memo, useEffect, useMemo, useState} from "react";
import {connect} from "react-redux";
import {SelectWithButtons} from "../components/SelectWithButtons";
import {useTranslation} from "../hooks/translation";
import {doCubeSet} from "../middleware/actions";
import {selectOlapCube} from "../state/selectors";
import {selectOlapCubeItems} from "../state/server/selectors";
import {groupBy} from "../utils/transform";
import {shallowEqualForProps} from "../utils/validation";

/** @type {React.FC<import("../components/SelectWithButtons").OwnProps<string>>} */
const SelectLevel = memo(SelectWithButtons, shallowEqualForProps("items", "selectedItem"));

/** @type {React.FC<import("../components/SelectWithButtons").OwnProps<OlapClient.PlainCube>>} */
const SelectAdaptedCube = memo(SelectWithButtons, shallowEqualForProps("items", "selectedItem"));

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {OlapClient.PlainCube[]} items
 * @property {OlapClient.PlainCube | undefined} selectedItem
 */

/**
 * @typedef DispatchProps
 * @property {(cube: OlapClient.PlainCube) => void} onItemSelect
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
export const SelectCube = props => {
  const {items, selectedItem} = props;

  const {translate: t} = useTranslation();

  const {
    level: level1,
    setLevel: setLevel1,
    keys: level1Keys,
    values: level1Values
  } = useLevel(items, selectedItem, item => item.annotations.topic);

  const {
    level: level2,
    setLevel: setLevel2,
    keys: level2Keys,
    values: level2Values
  } = useLevel(level1Values, selectedItem, item => item.annotations.subtopic);

  const {
    level: level3,
    setLevel: setLevel3,
    keys: level3Keys,
    values: level3Values
  } = useLevel(level2Values, selectedItem, item => item.annotations.table);

  const cubeItems =
    level3Values.length > 0 ? level3Values :
    level2Values.length > 0 ? level2Values :
    level1Values.length > 0 ? level1Values :
    /* else */                items;

  useEffect(() => {
    if (selectedItem && cubeItems.length > 0 && !cubeItems.includes(selectedItem)) {
      props.onItemSelect(cubeItems[0]);
    }
  }, [cubeItems, selectedItem]);

  const selectCube = selectedItem
    ? <SelectAdaptedCube
      className="select-cube"
      getLabel={item => item.caption || item.name}
      hidden={cubeItems.length < 2}
      items={cubeItems}
      onItemSelect={props.onItemSelect}
      selectedItem={selectedItem}
      text={t("params.label_cube", {
        name: selectedItem.name,
        caption: selectedItem.annotations.caption
      })}
    />
    : null;

  return (
    <Fragment>
      <SelectLevel
        className="select-topic"
        items={level1Keys}
        onItemSelect={setLevel1}
        selectedItem={level1}
        text={t("params.label_topic", {label: level1})}
      />
      <SelectLevel
        className="select-subtopic"
        items={level2Keys}
        onItemSelect={setLevel2}
        selectedItem={level2}
        text={t("params.label_subtopic", {label: level2})}
      />
      <SelectLevel
        className="select-table"
        items={level3Keys}
        onItemSelect={setLevel3}
        selectedItem={level3}
        text={t("params.label_table", {label: level3})}
      />
      {selectCube}
    </Fragment>
  );
};

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  items: selectOlapCubeItems(state),
  selectedItem: selectOlapCube(state)
});

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  onItemSelect(cube) {
    dispatch(doCubeSet(cube.name));
  }
});

export const ConnectedSelectCube = connect(mapState, mapDispatch)(SelectCube);

/**
 * @template T
 * @param {T[]} items
 * @param {T | undefined} currentItem
 * @param {(item: T) => string | null | undefined} accessor
 * @returns
 */
function useLevel(items, currentItem, accessor) {
  const [level, setLevel] = useState(() => currentItem && accessor(currentItem) || "");

  useEffect(() => {
    currentItem && setLevel(accessor(currentItem) || "");
  }, [currentItem]);

  const [keys, values] = useMemo(() => {
    const tree = groupBy(items, accessor);
    const keys = [...tree.keys()];
    const values = tree.get(level) || [];
    return [keys, values];
  }, [items, level]);

  return {level, setLevel, keys, values};
}
