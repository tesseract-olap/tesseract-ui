import {Button, ButtonGroup} from "@blueprintjs/core";
import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {willExecuteQuery, willHydrateParams, willParseQueryUrl} from "../middleware/olapActions";
import {doSetLoadingState} from "../state/loading/actions";
import {doQueriesRemove, doQueriesSelect, doQueriesUpdate} from "../state/queries/actions";
import {selectCurrentQueryItem, selectQueryItems} from "../state/queries/selectors";
import {buildQuery} from "../utils/structs";
import {LayoutColumn} from "./LayoutColumn";
import {MemoStoredQuery as StoredQuery} from "./StoredQuery";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
export const ExplorerQueries = props => {
  const dispatch = useDispatch();

  const currentQuery = useSelector(selectCurrentQueryItem);
  const items = useSelector(selectQueryItems);

  const {translate: t} = useTranslation();

  /** @type {() => void} */
  const onItemCreate = useCallback(() => {
    const query = buildQuery({params: currentQuery?.params});
    dispatch(doQueriesUpdate(query));
    dispatch(doQueriesSelect(query.key));
  }, [currentQuery]);

  /** @type {(itemKey: string) => void} */
  const onItemDelete = useCallback(itemKey => {
    dispatch(doQueriesRemove(itemKey));
  }, []);

  /** @type {(itemKey: string) => void} */
  const onItemSelect = useCallback(itemKey => {
    dispatch(doQueriesSelect(itemKey));
  }, []);

  const parseQueryUrlHandler = useCallback(() => {
    const string = window.prompt("Enter the URL of the query you want to parse:");
    if (string) {
      dispatch(doSetLoadingState("REQUEST"));
      const url = new URL(string);
      dispatch(willParseQueryUrl(url))
        .then(() => dispatch(willHydrateParams()))
        .then(() => dispatch(willExecuteQuery()))
        .then(
          () => dispatch(doSetLoadingState("SUCCESS")),
          error => dispatch(doSetLoadingState("FAILURE", error.message))
        );
    }
  }, []);

  return (
    <LayoutColumn
      className={props.className}
      title={t("queries.column_title")}
      defaultOpen={items.length > 1}
    >
      <ButtonGroup alignText="left" fill vertical>
        <Button
          className="action-create"
          icon="insert"
          onClick={onItemCreate}
          text={t("queries.action_create")}
        />
        <Button
          className="action-parseurl"
          icon="bring-data"
          onClick={parseQueryUrlHandler}
          text={t("queries.action_parse")}
        />
      </ButtonGroup>

      {items.map((item, _, list) =>
        <StoredQuery
          active={item === currentQuery}
          className="query-item"
          key={item.key}
          item={item}
          hideDelete={list.length === 1}
          onSelect={onItemSelect}
          onDelete={onItemDelete}
        />
      )}
    </LayoutColumn>
  );
};
