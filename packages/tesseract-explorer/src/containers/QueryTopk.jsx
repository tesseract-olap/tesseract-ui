import {Button, Intent} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {QueryArea} from "../components/QueryArea";
import TagTopk from "../components/TagTopk";
import {useTranslation} from "../hooks/translation";
import {doTopkClear, doTopkRemove, doTopkSelect, doTopkUpdate} from "../state/params/actions";
import {selectTopkItems} from "../state/params/selectors";
import {summaryTopk} from "../utils/format";
import {buildTopk} from "../utils/structs";
import {isActiveItem, isTopkItem} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {TessExpl.Struct.TopkItem[]} items
 */

/**
 * @typedef DispatchProps
 * @property {() => void} clearHandler
 * @property {() => void} createHandler
 * @property {(item: TessExpl.Struct.TopkItem) => void} removeHandler
 * @property {(item: TessExpl.Struct.TopkItem) => void} toggleHandler
 * @property {(item: TessExpl.Struct.TopkItem) => void} updateHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const QueryTopk = props => {
  const {items, removeHandler, toggleHandler, updateHandler} = props;

  const {translate: t} = useTranslation();

  const firstActiveItem = items.find(item => isActiveItem(item) && isTopkItem(item));
  const title = `${t("params.title_area_topk")}: ${firstActiveItem ? t("params.summary_topk", summaryTopk(firstActiveItem)) : t("placeholders.none")}`;
  const toolbar =
    <React.Fragment>
      {items.length > 0 &&
        <Button icon="trash" intent={Intent.DANGER} onClick={props.clearHandler} />
      }
      <Button icon="new-object" onClick={props.createHandler} />
    </React.Fragment>;

  return (
    <QueryArea
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
    </QueryArea>
  );
};

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  items: selectTopkItems(state)
});

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  clearHandler() {
    dispatch(doTopkClear());
  },
  createHandler() {
    const topkItem = buildTopk({active: true});
    dispatch(doTopkSelect(topkItem));
  },
  removeHandler(item) {
    dispatch(doTopkRemove(item.key));
  },
  toggleHandler(item) {
    dispatch(doTopkSelect({...item, active: !item.active}));
  },
  updateHandler(item) {
    dispatch(doTopkUpdate(item));
  }
});

export default connect(mapState, mapDispatch)(QueryTopk);
