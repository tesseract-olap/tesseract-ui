import {Button, Intent} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {QueryArea} from "../components/QueryArea";
import TagRca from "../components/TagRca";
import {useTranslation} from "../hooks/translation";
import {doRcaClear, doRcaRemove, doRcaSelect, doRcaUpdate} from "../state/params/actions";
import {selectRcaItems} from "../state/params/selectors";
import {summaryRca} from "../utils/format";
import {buildRca} from "../utils/structs";
import {isActiveItem, isRcaItem} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {TessExpl.Struct.RcaItem[]} items
 */

/**
 * @typedef DispatchProps
 * @property {() => void} clearHandler
 * @property {() => void} createHandler
 * @property {(item: TessExpl.Struct.RcaItem) => void} removeHandler
 * @property {(item: TessExpl.Struct.RcaItem) => void} toggleHandler
 * @property {(item: TessExpl.Struct.RcaItem) => void} updateHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const QueryRca = props => {
  const {items, removeHandler, toggleHandler, updateHandler} = props;

  const {translate: t} = useTranslation();

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
    <QueryArea
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
    </QueryArea>
  );
};

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  items: selectRcaItems(state)
});

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  clearHandler() {
    dispatch(doRcaClear());
  },
  createHandler() {
    const rcaItem = buildRca({});
    dispatch(doRcaUpdate(rcaItem));
  },
  removeHandler(item) {
    dispatch(doRcaRemove(item.key));
  },
  toggleHandler(item) {
    dispatch(doRcaSelect({...item, active: !item.active}));
  },
  updateHandler(item) {
    dispatch(doRcaUpdate(item));
  }
});

export default connect(mapState, mapDispatch)(QueryRca);
