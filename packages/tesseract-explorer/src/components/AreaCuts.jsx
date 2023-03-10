import {ActionIcon, Alert, Group} from "@mantine/core";
import {IconAlertCircle, IconCirclePlus, IconTrashX} from "@tabler/icons-react";
import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doCutClear, doCutRemove, doCutUpdate} from "../state/params/actions";
import {selectCutItems} from "../state/params/selectors";
import {buildCut} from "../utils/structs";
import {activeItemCounter} from "../utils/validation";
import {ButtonSelectLevel} from "./ButtonSelectLevel";
import {LayoutParamsArea} from "./LayoutParamsArea";
import {MemoTagCut as TagCut} from "./TagCut";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
export const AreaCuts = () => {
  const dispatch = useDispatch();

  const items = useSelector(selectCutItems);

  const {translate: t} = useTranslation();

  const clearHandler = useCallback(() => {
    dispatch(doCutClear());
  }, []);

  /** @type {(level: OlapClient.PlainLevel) => void} */
  const createHandler = useCallback(level => {
    const cutItem = buildCut(level);
    cutItem.active = false;
    dispatch(doCutUpdate(cutItem));
  }, []);

  /** @type {(item: TessExpl.Struct.CutItem) => void} */
  const removeHandler = useCallback(item => {
    dispatch(doCutRemove(item.key));
  }, []);

  /** @type {(item: TessExpl.Struct.CutItem) => void} */
  const toggleHandler = useCallback(item => {
    dispatch(doCutUpdate({...item, active: !item.active}));
  }, []);

  /** @type {(item: TessExpl.Struct.CutItem, members: string[]) => void} */
  const updateMembersHandler = useCallback((item, members) => {
    dispatch(doCutUpdate({...item, members}));
  }, []);

  const toolbar =
    <Group noWrap spacing="xs">
      {items.length > 0 &&
          <ActionIcon
            color="red"
            onClick={clearHandler}
            variant="subtle"
          >
            <IconTrashX />
          </ActionIcon>
      }
      <ButtonSelectLevel
        color="blue"
        onItemSelect={createHandler}
        selectedItems={items}
        variant="subtle"
      >
        <IconCirclePlus />
      </ButtonSelectLevel>
    </Group>;

  return (
    <LayoutParamsArea
      title={t("params.title_area_cuts", {n: `${items.reduce(activeItemCounter, 0)}`})}
      toolbar={toolbar}
      tooltip={t("params.tooltip_area_cuts")}
      value="cuts"
    >
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
    </LayoutParamsArea>
  );
};
