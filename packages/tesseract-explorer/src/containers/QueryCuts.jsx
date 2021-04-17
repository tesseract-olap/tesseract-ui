import {Button, Intent} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import ButtonSelectLevel from "../components/ButtonSelectLevel";
import {QueryArea} from "../components/QueryArea";
import {TagCut} from "../components/TagCut";
import {useTranslation} from "../hooks/translation";
import {doFetchMembers} from "../middleware/actions";
import {doCutClear, doCutRemove, doCutUpdate} from "../state/params/actions";
import {selectCutItems, selectLocale} from "../state/params/selectors";
import {buildCut} from "../utils/structs";
import {activeItemCounter} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {TessExpl.Struct.CutItem[]} items
 * @property {string} locale
 */

/**
 * @typedef DispatchProps
 * @property {() => void} clearHandler
 * @property {(item: import("@datawheel/olap-client").AdaptedLevel) => void} createHandler
 * @property {(item: TessExpl.Struct.CutItem) => Promise<TessExpl.Struct.MemberRecords>} loadMembersHandler
 * @property {(item: TessExpl.Struct.CutItem) => void} removeHandler
 * @property {(item: TessExpl.Struct.CutItem) => void} toggleHandler
 * @property {(item: TessExpl.Struct.CutItem, members: string[]) => void} updateMembersHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const QueryCuts = props => {
  const {items} = props;

  const {translate: t} = useTranslation();

  const toolbar =
    <React.Fragment>
      {items.length > 0 &&
        <Button icon="trash" intent={Intent.DANGER} onClick={props.clearHandler} />
      }
      <ButtonSelectLevel
        icon="new-object"
        onItemSelect={props.createHandler}
        selectedItems={items}
      />
    </React.Fragment>;

  return (
    <QueryArea
      className={props.className}
      open={true}
      title={t("params.title_area_cuts", {n: `${items.reduce(activeItemCounter, 0)}`})}
      toolbar={toolbar}
      tooltip={t("params.tooltip_area_cuts")}
    >
      {items.map(item =>
        <TagCut
          item={item}
          key={item.key}
          locale={props.locale}
          memberFetcher={props.loadMembersHandler}
          onMembersUpdate={props.updateMembersHandler}
          onRemove={props.removeHandler}
          onToggle={props.toggleHandler}
        />
      )}
    </QueryArea>
  );
};

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  items: selectCutItems(state),
  locale: selectLocale(state).code
});

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  clearHandler() {
    dispatch(doCutClear());
  },
  createHandler(level) {
    const cutItem = buildCut(level);
    dispatch(doCutUpdate(cutItem));
  },
  loadMembersHandler(item) {
    return doFetchMembers(dispatch, item).then(members => {
      dispatch(doCutUpdate({...item, active: true}));
      return members;
    });
  },
  removeHandler(item) {
    dispatch(doCutRemove(item.key));
  },
  toggleHandler(item) {
    dispatch(doCutUpdate({...item, active: !item.active}));
  },
  updateMembersHandler(item, members) {
    dispatch(doCutUpdate({...item, members}));
  }
});

export default connect(mapState, mapDispatch)(QueryCuts);
