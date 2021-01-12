import {
  Button,
  InputGroup,
  Intent,
  Popover,
  PopoverInteractionKind,
  Position
} from "@blueprintjs/core";
import React, {useState} from "react";
import {connect} from "react-redux";
import QueryArea from "../components/QueryArea";
import TagMeasure from "../components/TagMeasure";
import {doMeasureClear, doMeasureToggle} from "../state/params/actions";
import {selectMeasureItems} from "../state/params/selectors";
import {safeRegExp} from "../utils/transform";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {MeasureItem[]} items
 */

/**
 * @typedef DispatchProps
 * @property {() => void} clearHandler
 * @property {(item: MeasureItem) => void} toggleHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const QueryMeasures = props => {
  const [filter, setFilter] = useState("");

  let filteredItems = props.items;
  if (filter) {
    const query = safeRegExp(filter, "i");
    filteredItems = filteredItems.filter(item => query.test(item.measure));
  }

  const resetFilter = () => setFilter("");
  const toolbar =
    <Popover
      autoFocus={true}
      interactionKind={PopoverInteractionKind.HOVER}
      popoverClassName="param-popover"
      position={Position.BOTTOM}
    >
      <Button
        icon={filter ? "filter-remove" : "filter"}
        intent={filter ? Intent.DANGER : Intent.NONE}
        onClick={resetFilter}
      />
      <InputGroup
        className="item-filter"
        leftIcon="search"
        onChange={evt => setFilter(evt.target.value)}
        placeholder="Filter measures..."
        rightElement={
          filter.length > 0
            ? <Button icon="cross" minimal onClick={resetFilter} />
            : undefined
        }
        type="search"
        value={filter}
      />
    </Popover>;

  return (
    <QueryArea className={props.className} title="Columns" toolbar={toolbar} collapsable={false}>
      {filteredItems.map(item =>
        <TagMeasure
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
  items: selectMeasureItems(state)
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

export default connect(mapState, mapDispatch)(QueryMeasures);
