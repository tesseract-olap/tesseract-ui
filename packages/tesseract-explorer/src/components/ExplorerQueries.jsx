import {Button, Divider, Group, Space, Stack} from "@mantine/core";
import {IconForms, IconRowInsertBottom} from "@tabler/icons-react";
import React, {useCallback} from "react";
import {useSelector} from "react-redux";
import {useActions} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectCurrentQueryItem, selectQueryItems} from "../state/queries";
import {buildQuery} from "../utils/structs";
import {CollapsiblePanel} from "./Layout/CollapsiblePanel";
import {MemoStoredQuery as StoredQuery} from "./StoredQuery";

export const ExplorerQueries = () => {
  const actions = useActions();

  const currentQuery = useSelector(selectCurrentQueryItem);
  const items = useSelector(selectQueryItems);

  const {translate: t} = useTranslation();

  /** @type {() => void} */
  const onItemCreate = useCallback(() => {
    const query = buildQuery({params: currentQuery?.params});
    actions.updateQuery(query);
    actions.selectQuery(query.key);
  }, [currentQuery]);

  /** @type {(itemKey: string) => void} */
  const onItemDelete = useCallback(itemKey => {
    actions.removeQuery(itemKey);
  }, []);

  /** @type {(itemKey: string) => void} */
  const onItemSelect = useCallback(itemKey => {
    actions.selectQuery(itemKey);
  }, []);

  const parseQueryUrlHandler = useCallback(() => {
    const string = window.prompt("Enter the URL of the query you want to parse:");
    if (string) {
      actions.setLoadingState("FETCHING");
      const url = new URL(string);
      actions.willParseQueryUrl(url)
        .then(() => actions.willHydrateParams())
        .then(() => actions.willExecuteQuery())
        .then(
          () => actions.setLoadingState("SUCCESS"),
          error => actions.setLoadingState("FAILURE", error.message)
        );
    }
  }, []);

  return (
    <CollapsiblePanel
      id="layout-column-explorer-queries"
      title={t("queries.column_title")}
      defaultOpen={items.length > 1}
    >
      <Space h="xs" />
      <Group id="button-group-queries-actions" noWrap spacing="xs">
        <Button
          fullWidth
          leftIcon={<IconRowInsertBottom />}
          onClick={onItemCreate}
        >
          {t("queries.action_create")}
        </Button>
        <Button
          fullWidth
          leftIcon={<IconForms />}
          onClick={parseQueryUrlHandler}
        >
          {t("queries.action_parse")}
        </Button>
      </Group>
      <Divider my="xs" />
      <Stack id="button-group-stored-queries" spacing="xs">
        {items.map((item, _, list) =>
          <StoredQuery
            active={item === currentQuery}
            key={item.key}
            item={item}
            hideDelete={list.length === 1}
            onSelect={onItemSelect}
            onDelete={onItemDelete}
          />
        )}
      </Stack>
    </CollapsiblePanel>
  );
};
