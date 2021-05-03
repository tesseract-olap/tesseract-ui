import {Button, Intent} from "@blueprintjs/core";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doRcaClear, doRcaRemove, doRcaSelect, doRcaUpdate} from "../state/params/actions";
import {selectRcaItems} from "../state/params/selectors";
import {summaryRca} from "../utils/format";
import {buildRca} from "../utils/structs";
import {isActiveItem, isRcaItem} from "../utils/validation";
import {LayoutParamsArea} from "./LayoutParamsArea";
import TagRca from "./TagRca";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
export const AreaRca = props => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const items = useSelector(selectRcaItems);

  /** @type {() => void} */
  const clearHandler = () => {
    dispatch(doRcaClear());
  };

  /** @type {() => void} */
  const createHandler = () => {
    const rcaItem = buildRca({});
    dispatch(doRcaUpdate(rcaItem));
  };

  /** @type {(item: TessExpl.Struct.RcaItem) => void} */
  const removeHandler = item => {
    dispatch(doRcaRemove(item.key));
  };

  /** @type {(item: TessExpl.Struct.RcaItem) => void} */
  const toggleHandler = item => {
    dispatch(doRcaSelect({...item, active: !item.active}));
  };

  /** @type {(item: TessExpl.Struct.RcaItem) => void} */
  const updateHandler = item => {
    dispatch(doRcaUpdate(item));
  };


  const firstActiveItem = items.find(item => isActiveItem(item) && isRcaItem(item));
  const title = `${t("params.title_area_rca")}: ${firstActiveItem ? t("params.summary_rca", summaryRca(firstActiveItem)) : t("placeholders.none")}`;
  const toolbar =
    <React.Fragment>
      {items.length > 0 &&
        <Button icon="trash" intent={Intent.DANGER} onClick={props.clearHandler} />
      }
      <Button icon="new-object" onClick={props.createHandler} />
    </React.Fragment>;

  return (
    <LayoutParamsArea
      className={props.className}
      open={false}
      title={title}
      toolbar={toolbar}
      tooltip={t("params.tooltip_area_rca")}
    >
      {items.map(item =>
        <TagRca
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
