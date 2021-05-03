import {Button, Intent} from "@blueprintjs/core";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doFetchMembers} from "../middleware/actions";
import {doCutClear, doCutRemove, doCutUpdate} from "../state/params/actions";
import {selectCutItems, selectLocale} from "../state/params/selectors";
import {buildCut} from "../utils/structs";
import {activeItemCounter} from "../utils/validation";
import {MemoButtonSelectLevel as ButtonSelectLevel} from "./ButtonSelectLevel";
import {LayoutParamsArea} from "./LayoutParamsArea";
import {TagCut} from "./TagCut";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
export const AreaCuts = props => {
  const dispatch = useDispatch();

  const items = useSelector(selectCutItems);
  const locale = useSelector(selectLocale);

  const {translate: t} = useTranslation();

  const clearHandler = () => {
    dispatch(doCutClear());
  };

  /** @type {(level: OlapClient.PlainLevel) => void} */
  const createHandler = level => {
    const cutItem = buildCut(level);
    dispatch(doCutUpdate(cutItem));
  };

  /** @type {(item: TessExpl.Struct.CutItem) => Promise<TessExpl.Struct.MemberRecords>} */
  const loadMembersHandler = item =>
    doFetchMembers(dispatch, item)
      .then(members => {
        dispatch(doCutUpdate({...item, active: true}));
        return members;
      });

  /** @type {(item: TessExpl.Struct.CutItem) => void} */
  const removeHandler = item => {
    dispatch(doCutRemove(item.key));
  };

  /** @type {(item: TessExpl.Struct.CutItem) => void} */
  const toggleHandler = item => {
    dispatch(doCutUpdate({...item, active: !item.active}));
  };

  /** @type {(item: TessExpl.Struct.CutItem, members: string[]) => void} */
  const updateMembersHandler = (item, members) => {
    dispatch(doCutUpdate({...item, members}));
  };

  const toolbar =
    <React.Fragment>
      {items.length > 0 &&
        <Button icon="trash" intent={Intent.DANGER} onClick={clearHandler} />
      }
      <ButtonSelectLevel
        icon="new-object"
        onItemSelect={createHandler}
        selectedItems={items}
      />
    </React.Fragment>;

  return (
    <LayoutParamsArea
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
          locale={locale.code}
          memberFetcher={loadMembersHandler}
          onMembersUpdate={updateMembersHandler}
          onRemove={removeHandler}
          onToggle={toggleHandler}
        />
      )}
    </LayoutParamsArea>
  );
};
