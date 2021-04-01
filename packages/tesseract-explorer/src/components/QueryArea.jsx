import {Button, ButtonGroup, Divider, Icon, Intent} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import ScrollArea from "react-shadow-scroll";
import {IconTooltip} from "./Tooltips";

/**
 * @typedef OwnProps
 * @property {boolean} [open]
 * @property {string} [className]
 * @property {string} title
 * @property {React.ReactNode} [toolbar]
 * @property {string} [tooltip]
 * @property {string} [warning]
 * @property {() => void} [stopBubbling]
 */

/** @type {React.FC<OwnProps>} */
export const QueryArea = props => {
  const {tooltip, warning} = props;
  return (
    <details className={classNames("query-area", props.className)} open={props.open}>
      <summary className="details-title">
        <Icon className="icon-chevron" icon="chevron-right" />
        <span className="title">{props.title}</span>
        {tooltip && <IconTooltip tooltipText={tooltip} icon="info-sign" />}
        <span className="spacer"></span>
        <ButtonGroup minimal onClick={props.stopBubbling}>
          {props.toolbar}
          {warning && <Divider />}
          {warning && <Button disabled intent={Intent.WARNING} icon="warning-sign" />}
        </ButtonGroup>
      </summary>
      <ScrollArea isShadow={false}>{props.children}</ScrollArea>
    </details>
  );
};

QueryArea.defaultProps = {
  stopBubbling(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  }
};
