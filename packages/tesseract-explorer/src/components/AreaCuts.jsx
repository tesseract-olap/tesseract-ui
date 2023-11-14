import {ActionIcon, Alert, Stack} from "@mantine/core";
import {IconAlertCircle, IconCirclePlus, IconTrashX} from "@tabler/icons-react";
import React, {useCallback} from "react";
import {useActions} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectCutItems} from "../state/queries";
import {useSelector} from "../state/store";
import {buildCut} from "../utils/structs";
import {activeItemCounter} from "../utils/validation";
import {ButtonSelectLevel} from "./ButtonSelectLevel";
import {LayoutParamsArea} from "./LayoutParamsArea";
import {MemoTagCut as TagCut} from "./TagCut";

export const AreaCuts = () => {
  const actions = useActions();

  const items = useSelector(selectCutItems);

  const {translate: t} = useTranslation();

  const clearHandler = useCallback(() => {
    actions.resetCuts({});
  }, []);

  /** @type {(level: import("@datawheel/olap-client").PlainLevel) => void} */
  const createHandler = useCallback(level => {
    const cutItem = buildCut(level);
    cutItem.active = false;
    actions.updateCut(cutItem);
  }, []);

  /** @type {(item: import("../utils/structs").CutItem) => void} */
  const removeHandler = useCallback(item => {
    actions.removeCut(item.key);
  }, []);

  /** @type {(item: import("../utils/structs").CutItem) => void} */
  const toggleHandler = useCallback(item => {
    actions.updateCut({...item, active: !item.active});
  }, []);

  /** @type {(item: import("../utils/structs").CutItem, members: string[]) => void} */
  const updateMembersHandler = useCallback((item, members) => {
    actions.updateCut({...item, members});
  }, []);

  const toolbar =
    <>
      {items.length > 0 &&
        <ActionIcon color="red" onClick={clearHandler} variant="subtle">
          <IconTrashX />
        </ActionIcon>}
      <ButtonSelectLevel
        color="blue"
        onItemSelect={createHandler}
        selectedItems={items}
        variant="subtle"
      >
        <IconCirclePlus />
      </ButtonSelectLevel>
    </>;

  return (
    <LayoutParamsArea
      id="cuts"
      title={t("params.title_area_cuts", {n: `${items.reduce(activeItemCounter, 0)}`})}
      toolbar={toolbar}
      tooltip={t("params.tooltip_area_cuts")}
      value="cuts"
    >
      <Stack spacing="xs">
        {items.length === 0 && <Alert
          color="yellow"
          icon={<IconAlertCircle size="2rem" />}
          title={t("params.error_no_cut_selected_title")}
        >{t("params.error_no_cut_selected_detail")}</Alert>}
        {items.length > 0 && items.map(item =>
          <TagCut
            item={item}
            key={item.key}
            onMembersUpdate={updateMembersHandler}
            onRemove={removeHandler}
            onToggle={toggleHandler}
          />
        )}
      </Stack>
    </LayoutParamsArea>
  );
};
