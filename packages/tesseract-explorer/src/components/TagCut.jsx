import {Button, ButtonGroup, Callout, FormGroup, Intent, Spinner, Switch, Tag} from "@blueprintjs/core";
import {Popover2, Popover2InteractionKind} from "@blueprintjs/popover2";
import classNames from "classnames";
import React, {useEffect, useState} from "react";
import {abbreviateFullName} from "../utils/format";
import {levelRefToArray} from "../utils/transform";
import {useTranslation} from "../utils/localization";
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
 * @property {(item: TessExpl.Struct.CutItem) => Promise<TessExpl.Struct.MemberRecords>} [memberFetcher]
 * @property {(item: TessExpl.Struct.CutItem, members: string[]) => any} [onMembersUpdate]
 * @property {(item: TessExpl.Struct.CutItem) => any} [onRemove]
 */

/** @type {React.FC<OwnProps>} */
export const TagCut = props => {
  const {item, memberFetcher, onMembersUpdate, onRemove, onToggle} = props;
  const label = abbreviateFullName(levelRefToArray(item));

  const {translate: t} = useTranslation();

  const [error, setError] = useState("");
  const [members, setMembers] = useState({});
  const [isLoadingMembers, setLoadingMembers] = useState(true);

  const toggleHandler = () => {
    onToggle && onToggle(item);
  };
  const removeHandler = evt => {
    evt.stopPropagation();
    onRemove && onRemove(item);
  };
  const reloadHandler = () => {
    memberFetcher && memberFetcher(item)
      .then(members => {
        setError("");
        setMembers(members);
        setLoadingMembers(false);
      })
      .catch(err => {
        setError(`${err.message}\n${err.stack}`);
        setMembers({});
        setLoadingMembers(false);
      });
  };

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
      <Popover2
        content={
          <Callout
            icon="warning-sign"
            intent={Intent.WARNING}
            title={t("params.error_fetchmembers_title")}
          >
            <p>{t("params.error_fetchmembers_detail")}</p>
            <p>{error}</p>
            <p>
              <Button text={t("action_reload")} onClick={reloadHandler} />
            </p>
          </Callout>
        }
        fill={true}
        hoverCloseDelay={500}
        interactionKind={Popover2InteractionKind.CLICK}
      >
        <Tag
          className={classNames("tag-item tag-cut error", {hidden: !item.active})}
          large={true}
          fill={true}
          icon="warning-sign"
          rightIcon={
            <ButtonGroup minimal={true}>
              <ButtonTagExtra icon="refresh" title={t("action_reload")} onClick={reloadHandler} />
            </ButtonGroup>
          }
          intent={Intent.WARNING}
          onClick={toggleHandler}
          onRemove={removeHandler}
        >
          {label}
        </Tag>
      </Popover2>
    );
  }

  const activeCount = item.members.length;
  const uniqueActive = activeCount === 1 && members[item.members[0]];

  return (
    <Popover2
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
      hoverCloseDelay={500}
      interactionKind={Popover2InteractionKind.CLICK}
      modifiers={{
        flip: {options: {rootBoundary: "viewport"}},
        preventOverflow: {options: {rootBoundary: "viewport"}}
      }}
      popoverClassName="param-popover"
    >
      <Tag
        className={classNames("tag-item tag-cut", {hidden: !item.active})}
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
    </Popover2>
  );
};
