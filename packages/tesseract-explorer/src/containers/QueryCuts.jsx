import {Button, Intent} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import QueryArea from "../components/QueryArea";
import TagCut from "../components/TagCut";
import ButtonSelectLevel from "../components/ButtonSelectLevel";
import {doFetchMembers} from "../middleware/actions";
import {doCutUpdate, doCutRemove, doCutClear} from "../state/params/actions";
import {selectCutItems} from "../state/params/selectors";
import {buildCut} from "../utils/structs";
import {activeItemCounter} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {CutItem[]} items
 */

/**
 * @typedef DispatchProps
 * @property {() => void} clearHandler
 * @property {(item: OlapLevel) => void} createHandler
 * @property {(item: CutItem) => void} reloadMembersHandler
 * @property {(item: CutItem) => void} removeHandler
 * @property {(item: CutItem) => void} toggleHandler
 * @property {(item: CutItem, members: MemberItem[]) => void} updateMembersHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const QueryCuts = props => {
  const {items} = props;
  const totalCount = items.length;
  const activeCount = items.reduce(activeItemCounter, 0);

  const title = `Cuts (${activeCount})`;
  const toolbar =
    <React.Fragment>
      {totalCount > 0 &&
        <Button icon="trash" intent={Intent.DANGER} onClick={props.clearHandler} />
      }
      <ButtonSelectLevel
        icon="new-object"
        onItemSelect={props.createHandler}
        selectedItems={items}
      />
    </React.Fragment>;

  return (
    <QueryArea className={props.className} title={title} toolbar={toolbar}>
      {items.map(item =>
        <TagCut
          item={item}
          key={item.key}
          onMembersReload={props.reloadMembersHandler}
          onMembersUpdate={props.updateMembersHandler}
          onRemove={props.removeHandler}
          onToggle={props.toggleHandler}
        />
      )}
    </QueryArea>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  items: selectCutItems(state)
});

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  clearHandler() {
    dispatch(doCutClear());
  },
  createHandler(level) {
    const cutItem = buildCut(level);
    dispatch(doCutUpdate(cutItem));
    dispatch(doFetchMembers(cutItem));
  },
  reloadMembersHandler(item) {
    dispatch(doFetchMembers(item));
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
