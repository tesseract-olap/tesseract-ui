import {
  ButtonGroup,
  Callout,
  Classes,
  Icon,
  Intent,
  Popover,
  PopoverInteractionKind,
  Position,
  Spinner,
  Tag
} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import {connect} from "react-redux";
import {fetchMembers} from "../actions/client";
import {queryCutRemove, queryCutUpdate} from "../actions/query";
import {abbreviateFullName} from "../utils/format";
import {isActiveItem} from "../utils/validation";
import MemberSelector from "./MultiSelector";
import {levelRefToArray} from "../utils/transform";

/**
 * @typedef OwnProps
 * @property {import("../reducers").CutItem} item
 */

/**
 * @typedef DispatchProps
 * @property {() => any} toggleHandler
 * @property {(members: import("../reducers").MemberItem[]) => any} updateMembersHandler
 * @property {() => any} reloadMembersHandler
 * @property {(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any} removeHandler
 */

/** @type {React.FC<OwnProps & DispatchProps>} */
const TagCut = function({
  item,
  reloadMembersHandler,
  removeHandler,
  toggleHandler,
  updateMembersHandler
}) {
  const {active, members, error, membersLoaded} = item;
  const label = abbreviateFullName(levelRefToArray(item));

  let target, content;
  if (error) {
    const toolbar = (
      <ButtonGroup minimal={true}>
        <button
          type="button"
          className={Classes.TAG_REMOVE}
          onClick={reloadMembersHandler}
        >
          <Icon icon="refresh" iconSize={Icon.SIZE_STANDARD} />
        </button>
      </ButtonGroup>
    );
    target = (
      <Tag
        className={classNames("item-cut error", {hidden: !active})}
        large={true}
        fill={true}
        icon="warning-sign"
        rightIcon={toolbar}
        intent={Intent.WARNING}
        onClick={toggleHandler}
        onRemove={removeHandler}
      >
        {label}
      </Tag>
    );
    content = (
      <div className="cut-submenu error">
        <Callout
          icon="warning-sign"
          intent={Intent.WARNING}
          title="Error while loading member list"
        >
          <div>An error ocurred while loading the member list.</div>
          <div>{error}</div>
        </Callout>
      </div>
    );
  }
  else if (!membersLoaded) {
    return (
      <Tag
        className="item-cut loading"
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
    target = (
      <Tag
        className={classNames("item-cut", {hidden: !active})}
        icon="comparison"
        large={true}
        fill={true}
        interactive={true}
        onClick={toggleHandler}
        onRemove={removeHandler}
      >
        {`${label} (${activeCount === 1
          ? activeMembers[0].name
          : activeCount + " categories"})`}
      </Tag>
    );
    content = (
      <div className="cut-submenu">
        <MemberSelector items={members} onChange={updateMembersHandler} />
      </div>
    );
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

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
function mapDispatchToProps(dispatch, props) {
  return {
    toggleHandler() {
      const item = props.item;
      return dispatch(queryCutUpdate({...item, active: !item.active}));
    },
    updateMembersHandler(members) {
      const item = props.item;
      return dispatch(queryCutUpdate({...item, members}));
    },
    reloadMembersHandler() {
      return dispatch(fetchMembers(props.item));
    },
    removeHandler(evt) {
      evt.stopPropagation();
      return dispatch(queryCutRemove(props.item));
    }
  };
}

export default connect(null, mapDispatchToProps)(TagCut);
