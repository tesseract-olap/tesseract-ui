import {Button, Intent} from "@blueprintjs/core";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doGrowthClear, doGrowthRemove, doGrowthSelect, doGrowthUpdate} from "../state/params/actions";
import {selectGrowthItems} from "../state/params/selectors";
import {summaryGrowth} from "../utils/format";
import {buildGrowth} from "../utils/structs";
import {isActiveItem, isGrowthItem} from "../utils/validation";
import {LayoutParamsArea} from "./LayoutParamsArea";
import TagGrowth from "./TagGrowth";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
export const AreaGrowth = props => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const items = useSelector(selectGrowthItems);

  /** @type {() => void} */
  const clearHandler = () => {
    dispatch(doGrowthClear());
  };

  /** @type {() => void} */
  const createHandler = () => {
    const growthItem = buildGrowth({active: true});
    dispatch(doGrowthSelect(growthItem));
  };

  /** @type {(item: TessExpl.Struct.GrowthItem) => void} */
  const removeHandler = item => {
    dispatch(doGrowthRemove(item.key));
  };

  /** @type {(item: TessExpl.Struct.GrowthItem) => void} */
  const toggleHandler = item => {
    dispatch(doGrowthSelect({...item, active: !item.active}));
  };

  /** @type {(item: TessExpl.Struct.GrowthItem) => void} */
  const updateHandler = item => {
    dispatch(doGrowthUpdate(item));
  };

  const firstActiveItem = items.find(item => isActiveItem(item) && isGrowthItem(item));
  const title = `${t("params.title_area_growth")}: ${firstActiveItem ? t("params.summary_growth", summaryGrowth(firstActiveItem)) : t("placeholders.none")}`;
  const toolbar =
    <React.Fragment>
      {items.length > 0 &&
        <Button icon="trash" intent={Intent.DANGER} onClick={clearHandler} />
      }
      <Button icon="new-object" onClick={createHandler} />
    </React.Fragment>;

  return (
    <LayoutParamsArea
      className={props.className}
      open={false}
      title={title}
      toolbar={toolbar}
      tooltip={t("params.tooltip_area_growth")}
    >
      {items.map(item =>
        <TagGrowth
          item={item}
          key={item.key}
          onRemove={removeHandler}
          onToggle={toggleHandler}
          onUpdate={updateHandler}
        />
      )}
    </LayoutParamsArea>
  );
};
