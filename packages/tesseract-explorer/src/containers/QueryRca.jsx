import {Button, Intent} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import QueryArea from "../components/QueryArea";
import TagRca from "../components/TagRca";
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
 * @property {RcaItem[]} items
 */

/**
 * @typedef DispatchProps
 * @property {() => void} clearHandler
 * @property {() => void} createHandler
 * @property {(item: RcaItem) => void} removeHandler
 * @property {(item: RcaItem) => void} toggleHandler
 * @property {(item: RcaItem) => void} updateHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const QueryRca = props => {
  const {items, removeHandler, toggleHandler, updateHandler} = props;
  const totalCounter = items.length;
  const firstActiveItem = items
    .filter(item => isActiveItem(item) && isRcaItem(item))
    .pop();

  const title = `RCA: ${firstActiveItem ? summaryRca(firstActiveItem) : "None"}`;
  const toolbar =
    <React.Fragment>
      {totalCounter > 0 &&
        <Button icon="trash" intent={Intent.DANGER} onClick={props.clearHandler} />
      }
      <Button icon="new-object" onClick={props.createHandler} />
    </React.Fragment>;

  return (
    <QueryArea className={props.className} title={title} toolbar={toolbar}>
      {props.items.map(item =>
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

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  items: selectRcaItems(state)
});

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
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
