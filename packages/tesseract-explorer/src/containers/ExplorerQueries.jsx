import {Button} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {ExplorerColumn} from "../components/ExplorerColumn";
import {MemoStoredQuery as StoredQuery} from "../components/StoredQuery";
import {doQueriesSelect, doQueriesUpdate} from "../state/queries/actions";
import {selectCurrentQueryItem, selectQueryItems} from "../state/queries/selectors";
import {buildQuery} from "../utils/structs";

/**
 * @typedef OwnProps
 * @property {string} className
 */

/**
 * @typedef StateProps
 * @property {QueryItem} currentItem
 * @property {QueryItem[]} items
 */

/**
 * @typedef DispatchProps
 * @property {() => void} onItemCreate
 * @property {(item: string) => void} onItemSelect
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const ExplorerQueries = props => {
  const {onItemSelect, currentItem} = props;
  return (
    <ExplorerColumn className={props.className} title="Queries" defaultOpen={props.items.length > 1}>
      {props.items.map(item =>
        <StoredQuery
          active={item === currentItem}
          className="query-item"
          key={item.key}
          item={item}
          onClick={() => onItemSelect(item.key)}
        />
      )}
      <Button
        className="query-item create"
        icon="insert"
        large
        onClick={props.onItemCreate}
      />
    </ExplorerColumn>
  );
};

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  currentItem: selectCurrentQueryItem(state),
  items: selectQueryItems(state)
});

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  onItemCreate() {
    const query = buildQuery({});
    dispatch(doQueriesUpdate(query));
    dispatch(doQueriesSelect(query.key));
  },
  onItemSelect(item) {
    dispatch(doQueriesSelect(item));
  }
});

export default connect(mapState, mapDispatch)(ExplorerQueries);
