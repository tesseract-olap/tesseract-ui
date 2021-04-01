import {Button, Intent} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {QueryArea} from "../components/QueryArea";
import TagGrowth from "../components/TagGrowth";
import {
  doGrowthClear,
  doGrowthRemove,
  doGrowthSelect,
  doGrowthUpdate
} from "../state/params/actions";
import {selectGrowthItems} from "../state/params/selectors";
import {summaryGrowth} from "../utils/format";
import {buildGrowth} from "../utils/structs";
import {useTranslation} from "../utils/localization";
import {isActiveItem, isGrowthItem} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {TessExpl.Struct.GrowthItem[]} items
 */

/**
 * @typedef DispatchProps
 * @property {() => void} clearHandler
 * @property {() => void} createHandler
 * @property {(item: TessExpl.Struct.GrowthItem) => void} removeHandler
 * @property {(item: TessExpl.Struct.GrowthItem) => void} toggleHandler
 * @property {(item: TessExpl.Struct.GrowthItem) => void} updateHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const QueryGrowth = props => {
  const {items, removeHandler, toggleHandler, updateHandler} = props;

  const {translate: t} = useTranslation();

  const firstActiveItem = items.find(item => isActiveItem(item) && isGrowthItem(item));
  const title = `${t("params.title_area_growth")}: ${firstActiveItem ? t("params.summary_growth", summaryGrowth(firstActiveItem)) : t("placeholders.none")}`;
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
    </QueryArea>
  );
};

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  items: selectGrowthItems(state)
});

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  clearHandler() {
    dispatch(doGrowthClear());
  },
  createHandler() {
    const growthItem = buildGrowth({active: true});
    dispatch(doGrowthSelect(growthItem));
  },
  removeHandler(item) {
    dispatch(doGrowthRemove(item.key));
  },
  toggleHandler(item) {
    dispatch(doGrowthSelect({...item, active: !item.active}));
  },
  updateHandler(item) {
    dispatch(doGrowthUpdate(item));
  }
});

export default connect(mapState, mapDispatch)(QueryGrowth);
