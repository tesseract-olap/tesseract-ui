import {Button, Intent} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import QueryArea from "../components/QueryArea";
import TagGrowth from "../components/TagGrowth";
import {
  doGrowthClear,
  doGrowthRemove,
  doGrowthSelect,
  doGrowthUpdate
} from "../state/params/actions";
import {selectGrowthItems} from "../state/params/selectors";
import {summaryGrowth} from "../utils/format";
import {buildGrowth} from "../utils/structs";
import {isActiveItem, isGrowthItem} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {GrowthItem[]} items
 */

/**
 * @typedef DispatchProps
 * @property {() => void} clearHandler
 * @property {() => void} createHandler
 * @property {(item: GrowthItem) => void} removeHandler
 * @property {(item: GrowthItem) => void} toggleHandler
 * @property {(item: GrowthItem) => void} updateHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const QueryGrowth = props => {
  const {items, removeHandler, toggleHandler, updateHandler} = props;
  const totalCounter = items.length;
  const firstActiveItem = items
    .filter(item => isActiveItem(item) && isGrowthItem(item))
    .pop();

  const title = `Growth: ${firstActiveItem ? summaryGrowth(firstActiveItem) : "None"}`;
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
        <TagGrowth
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

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  items: selectGrowthItems(state)
});

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  clearHandler() {
    dispatch(doGrowthClear());
  },
  createHandler() {
    const growthItem = buildGrowth({active: true});
    dispatch(doGrowthSelect(growthItem));
  },
  removeHandler(item) {
    dispatch(doGrowthRemove(item.key));
  },
  toggleHandler(item) {
    dispatch(doGrowthSelect({...item, active: !item.active}));
  },
  updateHandler(item) {
    dispatch(doGrowthUpdate(item));
  }
});

export default connect(mapState, mapDispatch)(QueryGrowth);
