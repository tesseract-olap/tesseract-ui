import {Button, ButtonGroup, Callout, FormGroup, Intent, Popover, PopoverInteractionKind, Spinner, Switch, Tag} from "@blueprintjs/core";
import clsx from "classnames";
import React, {useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {willFetchMembers} from "../middleware/olapActions";
import {doCutUpdate} from "../state/params/actions";
import {abbreviateFullName} from "../utils/format";
import {buildMember} from "../utils/structs";
import {levelRefToArray} from "../utils/transform";
import {ButtonTagExtra} from "./ButtonTagExtra";
import {TransferInput} from "./TransferInput";

/** @type {React.FC<import("./TransferInput").OwnProps<TessExpl.Struct.MemberItem>>} */
// @ts-ignore
export const MembersTransferInput = TransferInput;

/**
 * @typedef OwnProps
 * @property {TessExpl.Struct.CutItem} item
 * @property {string} locale
 * @property {(item: TessExpl.Struct.CutItem) => any} [onToggle]
 * @property {(item: TessExpl.Struct.CutItem, members: string[]) => any} [onMembersUpdate]
 * @property {(item: TessExpl.Struct.CutItem) => any} [onRemove]
 */

/** @type {React.FC<OwnProps>} */
export const TagCut = props => {
  const dispatch = useDispatch();

  const {item, onMembersUpdate, onRemove, onToggle} = props;
  const label = abbreviateFullName(levelRefToArray(item));

  const {translate: t} = useTranslation();

  const [error, setError] = useState("");
  const [members, setMembers] = useState({});
  const [isLoadingMembers, setLoadingMembers] = useState(true);

  const toggleHandler = useCallback(() => {
    onToggle && onToggle(item);
  }, []);

  const removeHandler = useCallback(evt => {
    evt.stopPropagation();
    onRemove && onRemove(item);
  }, []);

  const reloadHandler = useCallback(() => {
    const activeMembers = item.members;
    dispatch(willFetchMembers(item))
      .then(members => {
        const memberRecords = {};
        let i = members.length;
        while (i--) {
          const member = members[i];
          const active = activeMembers.includes(`${member.key}`);
          memberRecords[member.key] = buildMember({name: member.caption, key: member.key, active});
        }
        !item.active && dispatch(doCutUpdate({...item, active: true}));
        setError("");
        setMembers(memberRecords);
        setLoadingMembers(false);
      })
      .catch(err => {
        setError(`${err.message}`);
        setMembers({});
        setLoadingMembers(false);
      });
  }, []);

  useEffect(reloadHandler, [item.key, props.locale]);

  if (isLoadingMembers) {
    return (
      <Tag
        className="tag-item tag-cut loading"
        fill={true}
        icon={<Spinner size={Spinner.SIZE_SMALL} />}
        large={true}
        minimal={true}
        onRemove={removeHandler}
      >
        {label}
      </Tag>
    );
  }

  if (error) {
    return (
      <Popover
        boundary="viewport"
        content={
          <Callout
            icon="warning-sign"
            intent={Intent.WARNING}
            title={t("params.error_fetchmembers_title")}
          >
            <p>{t("params.error_fetchmembers_detail")}</p>
            <p style={{whiteSpace: "pre-line"}}>{error}</p>
            <p>
              <Button text={t("action_reload")} onClick={reloadHandler} />
            </p>
          </Callout>
        }
        fill={true}
        hoverCloseDelay={500}
        interactionKind={PopoverInteractionKind.HOVER}
        popoverClassName="param-popover"
      >
        <Tag
          className={clsx("tag-item tag-cut error", {hidden: !item.active})}
          fill={true}
          icon="warning-sign"
          intent={Intent.WARNING}
          interactive={false}
          large={true}
          rightIcon={
            <ButtonGroup minimal={true}>
              <ButtonTagExtra icon="refresh" title={t("action_reload")} onClick={reloadHandler} />
            </ButtonGroup>
          }
          onRemove={removeHandler}
        >
          {label}
        </Tag>
      </Popover>
    );
  }

  const activeCount = item.members.length;
  const uniqueActive = activeCount === 1 && members[item.members[0]];

  return (
    <Popover
      boundary="viewport"
      content={
        <FormGroup className="submenu-form-group" label={t("params.title_members")}>
          <MembersTransferInput
            activeItems={item.members}
            getLabel={item => item.name}
            items={members}
            onChange={members => onMembersUpdate && onMembersUpdate(item, members)}
          />
        </FormGroup>
      }
      fill={true}
      interactionKind={PopoverInteractionKind.CLICK}
      popoverClassName="param-popover"
    >
      <Tag
        className={clsx("tag-item tag-cut", {hidden: !item.active})}
        icon={
          <span onClickCapture={evt => evt.stopPropagation()}>
            <Switch checked={item.active} onChange={toggleHandler} />
          </span>
        }
        large={true}
        fill={true}
        interactive={true}
        onRemove={removeHandler}
      >
        {`${label} (${uniqueActive ? uniqueActive.name : t("params.count_cuts", {n: activeCount})})`}
      </Tag>
    </Popover>
  );
};
