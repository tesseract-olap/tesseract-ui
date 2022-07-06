import {Button, Checkbox, InputGroup, Intent, Popover, PopoverInteractionKind, Position} from "@blueprintjs/core";
import React, {useCallback, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doMeasureToggle} from "../state/params/actions";
import {selectLocale, selectMeasureItems} from "../state/params/selectors";
import {selectOlapMeasureItems} from "../state/selectors";
import {getCaption} from "../utils/string";
import {safeRegExp} from "../utils/transform";
import {LayoutParamsArea} from "./LayoutParamsArea";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
export const AreaMeasures = props => {
  const dispatch = useDispatch();

  const {code: locale} = useSelector(selectLocale);
  const items = useSelector(selectMeasureItems);
  const measures = useSelector(selectOlapMeasureItems);

  const [filter, setFilter] = useState("");

  const {translate: t} = useTranslation();

  const filteredItems = useMemo(() => {
    if (filter) {
      const query = safeRegExp(filter, "i");
      return measures.filter(item => query.test(getCaption(item, locale)));
    }
    return measures;
  }, [measures, filter]);

  const resetFilter = useCallback(() => setFilter(""), []);
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
      title={t("params.title_area_measures", {n: items.length})}
      toolbar={toolbar}
      tooltip={t("params.tooltip_area_measures")}
    >
      {filteredItems.map(item =>
        <Checkbox
          checked={items.includes(item.name)}
          className="item-measure"
          key={item.name}
          label={getCaption(item, locale)}
          onChange={() => {
            dispatch(doMeasureToggle(item.name));
          }}
        />
      )}
    </LayoutParamsArea>
  );
};
