import {
  Button,
  Callout,
  Intent,
  Popover,
  PopoverInteractionKind,
  Spinner,
  Tag,
  ButtonGroup,
  Classes,
  Icon
} from "@blueprintjs/core";
import cn from "classnames";
import React from "react";
import {connect} from "react-redux";

import {QUERY_CUTS_REMOVE, QUERY_CUTS_UPDATE} from "../actions/query";
import {fetchMembers} from "../utils/api";
import MemberSelector from "./TagCutSelector";

function TagCut(props) {
  const drillable = props.drillable;
  const label = drillable.fullName.replace(/\./g, "/");

  if (props.loading) {
    return (
      <Button
        text={label}
        icon={<Spinner size={Spinner.SIZE_SMALL} />}
        fill={true}
        disabled={true}
      />
    );
  }

  let target, content;
  const allMembers = props.allMembers || [];
  if (props.error) {
    const toolbar = (
      <ButtonGroup minimal={true}>
        <button
          type="button"
          className={Classes.TAG_REMOVE}
          onClick={props.reloadMembersHandler}
        >
          <Icon icon="refresh" iconSize={Icon.SIZE_STANDARD} />
        </button>
      </ButtonGroup>
    );
    target = (
      <Tag
        className={cn("item-cut", {hidden: !props.active})}
        disabled={true}
        large={true}
        fill={true}
        icon="warning-sign"
        rightIcon={toolbar}
        intent={Intent.WARNING}
        onClick={props.toggleHandler}
        onRemove={props.removeHandler}
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
          <div>{props.error.message}</div>
        </Callout>
      </div>
    );
  }
  else {
    target = (
      <Tag
        className={cn("item-cut", {hidden: !props.active})}
        icon="comparison"
        large={true}
        fill={true}
        interactive={true}
        onClick={props.toggleHandler}
        onRemove={props.removeHandler}
      >
        {label + ` (${props.members.length})`}
      </Tag>
    );
    content = (
      <div className="cut-submenu">
        <MemberSelector
          activeItems={props.members}
          items={allMembers}
          onChange={props.updateMembersHandler}
        />
      </div>
    );
  }

  return (
    <Popover
      content={content}
      interactionKind={PopoverInteractionKind.HOVER}
      target={target}
      targetTagName="div"
    />
  );
}

function getCutFromProps(props) {
  const drillable = props.drillable;
  return {
    active: props.active,
    allMembers: props.allMembers,
    drillable,
    key: drillable.fullName,
    members: props.members
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    toggleHandler() {
      const payload = getCutFromProps(props);
      payload.active = !props.active;
      return dispatch({type: QUERY_CUTS_UPDATE, payload});
    },
    updateMembersHandler(members) {
      const payload = getCutFromProps(props);
      payload.members = members;
      return dispatch({type: QUERY_CUTS_UPDATE, payload});
    },
    reloadMembersHandler() {
      return fetchMembers(dispatch, props);
    },
    removeHandler(evt) {
      evt.stopPropagation();
      return dispatch({type: QUERY_CUTS_REMOVE, payload: props.drillable});
    }
  };
}

export default connect(null, mapDispatchToProps)(TagCut);
