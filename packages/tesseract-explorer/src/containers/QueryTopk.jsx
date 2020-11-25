import {Button, Intent} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import QueryArea from "../components/QueryArea";
import TagTopk from "../components/TagTopk";
import {
  doTopkClear,
  doTopkRemove,
  doTopkSelect,
  doTopkUpdate
} from "../state/params/actions";
import {selectTopkItems} from "../state/params/selectors";
import {summaryTopk} from "../utils/format";
import {buildTopk} from "../utils/structs";
import {isActiveItem, isTopkItem} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {TopkItem[]} items
 */

/**
 * @typedef DispatchProps
 * @property {() => void} clearHandler
 * @property {() => void} createHandler
 * @property {(item: TopkItem) => void} removeHandler
 * @property {(item: TopkItem) => void} toggleHandler
 * @property {(item: TopkItem) => void} updateHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const QueryTopk = props => {
  const {items, removeHandler, toggleHandler, updateHandler} = props;
  const totalCounter = items.length;
  const firstActiveItem = items
    .filter(item => isActiveItem(item) && isTopkItem(item))
    .pop();

  const title = firstActiveItem ? summaryTopk(firstActiveItem) : "Topk: None";
  const toolbar =
    <React.Fragment>
      {totalCounter > 0 &&
        <Button icon="trash" intent={Intent.DANGER} onClick={props.clearHandler} />
      }
      <Button icon="new-object" onClick={props.createHandler} />
    </React.Fragment>;

  return (
    <QueryArea className={props.className} title={title} toolbar={toolbar}>
      {items.map(item =>
        <TagTopk
          item={item}
          key={item.key}
          onRemove={removeHandler}
          onToggle={toggleHandler}
          onUpdate={updateHandler}
        />
      )}
    </QueryArea>
  );
};

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  items: selectTopkItems(state)
});

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  clearHandler() {
    dispatch(doTopkClear());
  },
  createHandler() {
    const topkItem = buildTopk({active: true});
    dispatch(doTopkSelect(topkItem));
  },
  removeHandler(item) {
    dispatch(doTopkRemove(item.key));
  },
  toggleHandler(item) {
    dispatch(doTopkSelect({...item, active: !item.active}));
  },
  updateHandler(item) {
    dispatch(doTopkUpdate(item));
  }
});

export default connect(mapState, mapDispatch)(QueryTopk);
