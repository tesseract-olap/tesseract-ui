import {Button, Intent} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import QueryArea from "../components/QueryArea";
import TagMeasure from "../components/TagMeasure";
import {doMeasureClear, doMeasureToggle} from "../state/params/actions";
import {selectFilterItems} from "../state/params/selectors";
import {activeItemCounter} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {FilterItem[]} items
 */

/**
 * @typedef DispatchProps
 * @property {() => void} clearHandler
 * @property {(item: MeasureItem) => void} toggleHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const QueryFilters = props => {
  const {items} = props;
  const totalCount = items.length;
  const activeCount = items.reduce(activeItemCounter, 0);

  const title = `Filters (${activeCount})`;
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
        <TagFilter
          item={item}
          key={item.key}
          onToggle={() => props.toggleHandler(item)}
        />
      )}
    </QueryArea>
  );
};

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  items: selectFilterItems(state)
});

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  clearHandler() {
    dispatch(doMeasureClear());
  },
  toggleHandler(item) {
    dispatch(doMeasureToggle({...item, active: !item.active}));
  }
});

export default connect(mapState, mapDispatch)(QueryFilters);
