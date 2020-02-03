import {Button, ButtonGroup, Callout, Intent, Popover, PopoverInteractionKind, Position, Spinner, Tag} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import {abbreviateFullName} from "../utils/format";
import {levelRefToArray} from "../utils/transform";
import {isActiveItem} from "../utils/validation";
import ButtonTagExtra from "./ButtonTagExtra";
import TransferInput from "./TransferInput";

/**
 * @typedef OwnProps
 * @property {CutItem} item
 * @property {(item: CutItem) => any} [onToggle]
 * @property {(item: CutItem, members: MemberItem[]) => any} [onMembersUpdate]
 * @property {(item: CutItem) => any} [onMembersReload]
 * @property {(item: CutItem) => any} [onRemove]
 */

/** @type {React.FC<OwnProps>} */
const TagCut = props => {
  const {item} = props;
  const {active, members, error, membersLoaded} = item;
  const label = abbreviateFullName(levelRefToArray(item));

  const toggleHandler = () => props.onToggle(item);
  const removeHandler = evt => {
    evt.stopPropagation();
    props.onRemove(item);
  };

  let content, target;
  if (error) {
    const reloadHandler = () => props.onMembersReload(item);
    target =
      <Tag
        className={classNames("tag-item tag-cut error", {hidden: !active})}
        large={true}
        fill={true}
        icon="warning-sign"
        rightIcon={
          <ButtonGroup minimal={true}>
            <ButtonTagExtra icon="refresh" onClick={reloadHandler} />
          </ButtonGroup>
        }
        intent={Intent.WARNING}
        onClick={toggleHandler}
        onRemove={removeHandler}
      >
        {label}
      </Tag>
    ;
    content =
      <div className="cut-submenu error">
        <Callout
          icon="warning-sign"
          intent={Intent.WARNING}
          title="Error while loading member list"
        >
          <p>An error ocurred while loading the member list.</p>
          <p>{error}</p>
          <p>
            <Button text="Reload" onClick={reloadHandler} />
          </p>
        </Callout>
      </div>
    ;
  }
  else if (!membersLoaded) {
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
  else {
    const activeMembers = members.filter(isActiveItem);
    const activeCount = activeMembers.length;
    target =
      <Tag
        className={classNames("tag-item tag-cut", {hidden: !active})}
        icon="comparison"
        large={true}
        fill={true}
        interactive={true}
        onClick={toggleHandler}
        onRemove={removeHandler}
      >
        {`${label} (${activeCount === 1
          ? activeMembers[0].name
          : `${activeCount  } categories`})`}
      </Tag>
    ;
    content =
      <div className="cut-submenu">
        <TransferInput
          items={members}
          onChange={members => props.onMembersUpdate(item, members)}
        />
      </div>
    ;
  }

  return (
    <Popover
      autoFocus={true}
      boundary="viewport"
      content={content}
      hoverCloseDelay={500}
      interactionKind={PopoverInteractionKind.HOVER}
      position={Position.RIGHT_TOP}
      target={target}
      targetTagName="div"
    />
  );
};

export default TagCut;
