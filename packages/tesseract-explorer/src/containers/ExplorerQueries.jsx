import {Button, ButtonGroup} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {ExplorerColumn} from "../components/ExplorerColumn";
import {MemoStoredQuery as StoredQuery} from "../components/StoredQuery";
import {useTranslation} from "../hooks/translation";
import {doParseQueryUrl} from "../middleware/actions";
import {doQueriesSelect, doQueriesUpdate} from "../state/queries/actions";
import {selectCurrentQueryItem, selectQueryItems} from "../state/queries/selectors";
import {buildQuery} from "../utils/structs";

/**
 * @typedef OwnProps
 * @property {string} className
 */

/**
 * @typedef StateProps
 * @property {TessExpl.Struct.QueryItem} currentItem
 * @property {TessExpl.Struct.QueryItem[]} items
 */

/**
 * @typedef DispatchProps
 * @property {(currentQuery?: TessExpl.Struct.QueryItem) => void} onItemCreate
 * @property {(item: string) => void} onItemSelect
 * @property {() => any} parseQueryUrlHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const ExplorerQueries = props => {
  const {onItemSelect, currentItem} = props;
  const {translate: t} = useTranslation();

  return (
    <ExplorerColumn className={props.className} title={t("queries.column_title")} defaultOpen={props.items.length > 1}>
      <ButtonGroup alignText="left" fill vertical>
        <Button
          className="action-create"
          icon="insert"
          onClick={() => props.onItemCreate(currentItem)}
          text={t("queries.action_create")}
        />
        <Button
          className="action-parseurl"
          icon="bring-data"
          onClick={props.parseQueryUrlHandler}
          text={t("queries.action_parse")}
        />
      </ButtonGroup>

      {props.items.map(item =>
        <StoredQuery
          active={item === currentItem}
          className="query-item"
          key={item.key}
          item={item}
          onClick={() => onItemSelect(item.key)}
        />
      )}
    </ExplorerColumn>
  );
};

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  currentItem: selectCurrentQueryItem(state),
  items: selectQueryItems(state)
});

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  onItemCreate(currentQuery) {
    const query = buildQuery({params: currentQuery?.params});
    dispatch(doQueriesUpdate(query));
    dispatch(doQueriesSelect(query.key));
  },
  onItemSelect(item) {
    dispatch(doQueriesSelect(item));
  },
  parseQueryUrlHandler() {
    const string = window.prompt("Enter the URL of the query you want to parse:");
    if (string) {
      const url = new URL(string);
      dispatch(doParseQueryUrl(url.toString()));
    }
  }
});

export default connect(mapState, mapDispatch)(ExplorerQueries);
