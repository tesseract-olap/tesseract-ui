import {Button, ButtonGroup, Callout, FormGroup, Intent, Popover, PopoverInteractionKind, Spinner, SpinnerSize, Switch, Tag} from "@blueprintjs/core";
import clsx from "classnames";
import React, {memo, useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {willFetchMembers} from "../middleware/olapActions";
import {doCutUpdate} from "../state/params/actions";
import {selectLocale} from "../state/params/selectors";
import {selectLevelTriadMap} from "../state/selectors";
import {abbreviateFullName} from "../utils/format";
import {getCaption} from "../utils/string";
import {buildMember} from "../utils/structs";
import {ButtonTagExtra} from "./ButtonTagExtra";
import {TransferInput} from "./TransferInput";

/** @type {React.FC<import("./TransferInput").OwnProps<TessExpl.Struct.MemberItem>>} */
// @ts-ignore
export const MembersTransferInput = TransferInput;

/**
 * @type {React.FC<{
 *  item: TessExpl.Struct.CutItem,
 *  onMembersUpdate?: (item: TessExpl.Struct.CutItem, members: string[]) => any,
 *  onRemove?: (item: TessExpl.Struct.CutItem) => any,
 *  onToggle?: (item: TessExpl.Struct.CutItem) => any,
 * }>}
 */
export const TagCut = props => {
  const {item, onMembersUpdate, onRemove, onToggle} = props;
  const {translate: t} = useTranslation();

  const dispatch = useDispatch();
  const locale = useSelector(selectLocale);

  const levelTriadMap = useSelector(selectLevelTriadMap);
  const triad = levelTriadMap[`${item.dimension}.${item.hierarchy}.${item.level}`];

  const [error, setError] = useState("");
  const [members, setMembers] = useState(Object.create(null));
  const [isLoadingMembers, setLoadingMembers] = useState(true);

  const toggleHandler = useCallback(() => {
    onToggle && onToggle(item);
  }, [item.active]);

  const removeHandler = useCallback(evt => {
    evt.stopPropagation();
    onRemove && onRemove(item);
  }, [item.key]);

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

  useEffect(reloadHandler, [item.key, locale.code]);

  const label = useMemo(() => {
    const triadCaptions = triad.map(item => getCaption(item, locale.code));
    return t("params.tag_drilldowns", {
      abbr: abbreviateFullName(triadCaptions, t("params.tag_drilldowns_abbrjoint")),
      dimension: triadCaptions[0],
      hierarchy: triadCaptions[1],
      level: triadCaptions[2],
      memberCount: item.members.length
    });
  }, [item.members.join("-"), item, locale.code]);

  if (isLoadingMembers) {
    return <TagCutLoading onRemove={removeHandler}>{label}</TagCutLoading>;
  }

  if (error) {
    return (
      <TagCutError
        error={error}
        item={props.item}
        onReload={reloadHandler}
        onRemove={removeHandler}
      >
        {label}
      </TagCutError>
    );
  }

  const activeCount = item.members.length;
  const uniqueActive = activeCount === 1 && members[item.members[0]];
  // eslint-disable-next-line eqeqeq
  const showMemberKey = triad[2].annotations.memberid_in_ui != "false";

  return (
    <Popover
      boundary="viewport"
      content={
        <FormGroup className="submenu-form-group" label={t("params.title_members")}>
          <MembersTransferInput
            activeItems={item.members}
            getLabel={item => item.name}
            getSecondLabel={showMemberKey
              // eslint-disable-next-line eqeqeq
              ? item => item.key != item.name ? item.key : undefined
              : undefined}
            itemPredicate={(query, item) => query.test(item.name) || query.test(item.key)}
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
        {t("params.tag_cuts", {
          abbr: label,
          first_member: uniqueActive ? uniqueActive.name : "",
          n: activeCount
        })}
      </Tag>
    </Popover>
  );
};

export const MemoTagCut = memo(TagCut);

/**
 * @type {React.FC<{
 *  onRemove: () => void,
 * }>}
 */
const TagCutLoading = props =>
  <Tag
    className="tag-item tag-cut loading"
    fill={true}
    icon={<Spinner size={SpinnerSize.SMALL} />}
    large={true}
    minimal={true}
    onRemove={props.onRemove}
  >
    {props.children}
  </Tag>;

/**
 * @type {React.FC<{
 *  item: TessExpl.Struct.CutItem,
 *  error: string,
 *  onReload: () => void,
 *  onRemove: () => void,
 * }>}
 */
const TagCutError = props => {
  const {translate: t} = useTranslation();

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
          <p style={{whiteSpace: "pre-line"}}>{props.error}</p>
          <p>
            <Button text={t("action_reload")} onClick={props.onReload} />
          </p>
        </Callout>
      }
      fill={true}
      hoverCloseDelay={500}
      interactionKind={PopoverInteractionKind.HOVER}
      popoverClassName="param-popover"
    >
      <Tag
        className={clsx("tag-item tag-cut error", {hidden: !props.item.active})}
        fill={true}
        icon="warning-sign"
        intent={Intent.WARNING}
        interactive={false}
        large={true}
        rightIcon={
          <ButtonGroup minimal={true}>
            <ButtonTagExtra icon="refresh" title={t("action_reload")} onClick={props.onReload} />
          </ButtonGroup>
        }
        onRemove={props.onRemove}
      >
        {props.children}
      </Tag>
    </Popover>
  );
};
