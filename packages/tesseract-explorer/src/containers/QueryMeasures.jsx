import {
  Button,
  InputGroup,
  Intent,
  Popover,
  PopoverInteractionKind,
  Position
} from "@blueprintjs/core";
import React, {useMemo, useState} from "react";
import {connect} from "react-redux";
import QueryArea from "../components/QueryArea";
import TagMeasure from "../components/TagMeasure";
import {doMeasureClear, doMeasureToggle} from "../state/params/actions";
import {selectMeasureItems} from "../state/params/selectors";
import {safeRegExp} from "../utils/transform";
import {useTranslation} from "../utils/useTranslation";
import {activeItemCounter} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {TessExpl.Struct.MeasureItem[]} items
 */

/**
 * @typedef DispatchProps
 * @property {() => void} clearHandler
 * @property {(item: TessExpl.Struct.MeasureItem) => void} toggleHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const QueryMeasures = props => {
  const [filter, setFilter] = useState("");

  const {translate: t} = useTranslation();

  const items = useMemo(() => {
    if (filter) {
      const query = safeRegExp(filter, "i");
      return props.items.filter(item => query.test(item.measure));
    }
    return props.items;
  }, [props.items, filter]);

  const title = `${t("params.title_area_measures")} (${props.items.reduce(activeItemCounter, 0)})`;

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
        placeholder={t("params.search_placeholder")}
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
    <QueryArea className={props.className} title={title} toolbar={toolbar}>
      {items.map(item =>
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
