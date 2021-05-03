import {Button, Intent} from "@blueprintjs/core";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doTopkClear, doTopkRemove, doTopkSelect, doTopkUpdate} from "../state/params/actions";
import {selectTopkItems} from "../state/params/selectors";
import {summaryTopk} from "../utils/format";
import {buildTopk} from "../utils/structs";
import {isActiveItem, isTopkItem} from "../utils/validation";
import {LayoutParamsArea} from "./LayoutParamsArea";
import TagTopk from "./TagTopk";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
export const AreaTopk = props => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const items = useSelector(selectTopkItems);

  /** @type {() => void} */
  const clearHandler = () => {
    dispatch(doTopkClear());
  };

  /** @type {() => void} */
  const createHandler = () => {
    const topkItem = buildTopk({active: true});
    dispatch(doTopkSelect(topkItem));
  };

  /** @type {(item: TessExpl.Struct.TopkItem) => void} */
  const removeHandler = item => {
    dispatch(doTopkRemove(item.key));
  };

  /** @type {(item: TessExpl.Struct.TopkItem) => void} */
  const toggleHandler = item => {
    dispatch(doTopkSelect({...item, active: !item.active}));
  };

  /** @type {(item: TessExpl.Struct.TopkItem) => void} */
  const updateHandler = item => {
    dispatch(doTopkUpdate(item));
  };

  const firstActiveItem = items.find(item => isActiveItem(item) && isTopkItem(item));
  const title = `${t("params.title_area_topk")}: ${firstActiveItem ? t("params.summary_topk", summaryTopk(firstActiveItem)) : t("placeholders.none")}`;
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
      tooltip={t("params.tooltip_area_topk")}
    >
      {items.map(item =>
        <TagTopk
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
