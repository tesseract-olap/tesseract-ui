import {Button, Intent} from "@blueprintjs/core";
import React, {Fragment} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doMeasureClear, doMeasureToggle} from "../state/params/actions";
import {selectFilterItems} from "../state/params/selectors";
import {activeItemCounter} from "../utils/validation";
import {LayoutParamsArea} from "./LayoutParamsArea";
import TagFilter from "./TagFilter";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
export const AreaFilters = props => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const items = useSelector(selectFilterItems);

  /** @type {() => void} */
  const clearHandler = () => {
    dispatch(doMeasureClear());
  };

  /** @type {() => void} */
  const createHandler = () => {};

  /** @type {(item: TessExpl.Struct.MeasureItem) => void} */
  const toggleHandler = item => {
    dispatch(doMeasureToggle({...item, active: !item.active}));
  };

  const toolbar =
    <Fragment>
      {items.length > 0 &&
        <Button icon="trash" intent={Intent.DANGER} onClick={clearHandler} />
      }
      <Button icon="new-object" onClick={createHandler} />
    </Fragment>;

  return (
    <LayoutParamsArea
      className={props.className}
      open={true}
      title={t("params.title_area_filters")}
      toolbar={toolbar}
      tooltip={t("params.title_area_filters", {n: `${items.reduce(activeItemCounter, 0)}`})}
    >
      {items.map(item =>
        <TagFilter item={item} key={item.key} onToggle={toggleHandler} />
      )}
    </LayoutParamsArea>
  );
};
