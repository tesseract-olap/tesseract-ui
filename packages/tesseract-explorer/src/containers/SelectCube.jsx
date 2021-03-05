import {Alignment, Button} from "@blueprintjs/core";
import React, {Fragment, memo, useEffect, useMemo, useState} from "react";
import {connect} from "react-redux";
import {SelectObject, SelectPrimitive} from "../components/Select";
import {doCubeSet} from "../middleware/actions";
import {selectOlapCube} from "../state/selectors";
import {selectOlapCubeItems} from "../state/server/selectors";
import {useTranslation} from "../utils/localization";
import {regroup} from "../utils/transform";
import {shallowEqualForProps} from "../utils/validation";

/** @type {React.FC<import("../components/Select").SelectObjectProps<import("@datawheel/olap-client").AdaptedCube>>} */
const SelectAdaptedCube = memo(SelectObject, shallowEqualForProps("items", "selectedItem"));

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {import("@datawheel/olap-client").AdaptedCube[]} items
 * @property {import("@datawheel/olap-client").AdaptedCube | undefined} selectedItem
 */

/**
 * @typedef DispatchProps
 * @property {(cube: import("@datawheel/olap-client").AdaptedCube) => void} onItemSelect
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
export const SelectCube = props => {
  const {items, selectedItem} = props;

  const {translate: t} = useTranslation();

  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");

  const topicTree = useMemo(() => {
    const getters = [item => item.annotations.topic, item => item.annotations.subtopic]
      .filter(getter => items.some(getter));
    return regroup(items, item => item, ...getters);
  }, [items]);

  const topicItems = useMemo(() => [...topicTree.keys()], [topicTree]);

  const subtopicItems = useMemo(() => {
    const topicChildren = topicTree.get(topic) || [];
    return !Array.isArray(topicChildren) ? [...topicChildren.keys()] : [];
  }, [topicTree, topic]);

  const cubeItems = useMemo(() => {
    if (topicItems.length === 0) return items;
    const topicChildren = topicTree.get(topic) || [];
    if (Array.isArray(topicChildren)) return topicChildren;
    const subtopicChildren = topicChildren.get(subtopic) || [];
    return Array.isArray(subtopicChildren) ? subtopicChildren : [];
  }, [topicTree, topic, subtopic]);

  useEffect(() => {
    if (!items.length || !selectedItem) return;

    if (topicItems.length > 0 && !topicItems.includes(topic)) {
      setTopic(topicItems[0]);
    }
    if (subtopicItems.length > 0 && !subtopicItems.includes(subtopic)) {
      setSubtopic(subtopicItems[0]);
    }
    if (cubeItems.length > 0 && !cubeItems.includes(selectedItem)) {
      props.onItemSelect(cubeItems[0]);
    }
  }, [items, selectedItem, topic, subtopic]);

  const selectTopic = topicItems.length > 0 && topic
    ? topicItems.length > 1
      ? <SelectPrimitive
        className="select-topic"
        fill={true}
        icon="folder-open"
        items={topicItems}
        onItemSelect={topic => {
          setTopic(topic);
          setSubtopic("");
        }}
        selectedItem={t("params.label_topic", {label: topic})}
      />
      : <Button
        alignText={Alignment.LEFT}
        className="select-topic unique"
        icon="folder-open"
        text={t("params.label_topic", {label: topic})}
      />
    : null;

  const selectSubtopic = subtopicItems.length > 0 && subtopic
    ? subtopicItems.length > 1
      ? <SelectPrimitive
        className="select-subtopic"
        fill={true}
        icon="properties"
        items={subtopicItems}
        onItemSelect={setSubtopic}
        selectedItem={t("params.label_subtopic", {label: subtopic})}
      />
      : <Button
        alignText={Alignment.LEFT}
        className="select-subtopic unique"
        icon="properties"
        text={t("params.label_subtopic", {label: subtopic})}
      />
    : null;

  const selectCube = selectedItem
    ? cubeItems.length > 1
      ? <SelectAdaptedCube
        className="select-cube"
        fill={true}
        getLabel={item => item.caption || item.name}
        icon="cube"
        items={cubeItems}
        onItemSelect={props.onItemSelect}
        selectedItem={t("params.label_cube", {
          name: selectedItem.name,
          caption: selectedItem.annotations.caption
        })}
      />
      : <Button
        alignText={Alignment.LEFT}
        className="select-cube unique"
        icon="cube"
        text={t("params.label_cube", {
          name: selectedItem.name,
          caption: selectedItem.annotations.caption
        })}
      />
    : null;

  return (
    <Fragment>
      {selectTopic}
      {selectSubtopic}
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
