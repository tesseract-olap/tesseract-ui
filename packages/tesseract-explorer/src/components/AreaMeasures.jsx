import {Button, InputGroup, Intent, Popover, PopoverInteractionKind, Position} from "@blueprintjs/core";
import React, {useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doMeasureToggle} from "../state/params/actions";
import {selectMeasureItems} from "../state/params/selectors";
import {safeRegExp} from "../utils/transform";
import {activeItemCounter} from "../utils/validation";
import {LayoutParamsArea} from "./LayoutParamsArea";
import TagMeasure from "./TagMeasure";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
export const AreaMeasures = props => {
  const dispatch = useDispatch();

  const items = useSelector(selectMeasureItems);

  const [filter, setFilter] = useState("");

  const {translate: t} = useTranslation();

  const filteredItems = useMemo(() => {
    if (filter) {
      const query = safeRegExp(filter, "i");
      return items.filter(item => query.test(item.measure));
    }
    return items;
  }, [items, filter]);

  /** @type {(item: TessExpl.Struct.MeasureItem) => void} */
  const toggleHandler = item => {
    dispatch(doMeasureToggle({...item, active: !item.active}));
  };

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
    <LayoutParamsArea
      className={props.className}
      open={true}
      title={t("params.title_area_measures", {n: `${items.reduce(activeItemCounter, 0)}`})}
      toolbar={toolbar}
      tooltip={t("params.tooltip_area_measures")}
    >
      {filteredItems.map(item =>
        <TagMeasure item={item} key={item.key} onToggle={toggleHandler} />
      )}
    </LayoutParamsArea>
  );
};
