import {Button, ButtonGroup, Divider, Icon, Intent} from "@blueprintjs/core";
import React, {Fragment} from "react";
import ScrollArea from "react-shadow-scroll";
import classNames from "classnames";

/**
 * @typedef OwnProps
 * @property {boolean} [open]
 * @property {boolean} [collapsable]
 * @property {string} [className]
 * @property {string} title
 * @property {React.ReactNode} [toolbar]
 * @property {string} [warning]
 * @property {() => void} [stopBubbling]
 */

/** @type {React.FC<OwnProps>} */
const QueryArea = ({children, className, collapsable = true, open = true, stopBubbling, title, toolbar, warning}) => {

  const content = <Fragment>
    <summary className="details-title">
      <Icon className="icon-chevron" icon={collapsable ? "chevron-right" : "blank"} />
      <span className="title">{title}</span>
      <ButtonGroup minimal onClick={stopBubbling}>
        {toolbar}
        {warning && <Divider />}
        {warning && <Button disabled intent={Intent.WARNING} icon="warning-sign" />}
      </ButtonGroup>
    </summary>
    <ScrollArea isShadow={false}>{children}</ScrollArea>
  </Fragment>;

  return collapsable
    ? <details className={classNames("query-area", className)} open={open}>{content}</details>
    : <div className={classNames("query-area", className)}>{content}</div>;
};

QueryArea.defaultProps = {
  stopBubbling(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  }
};

export default QueryArea;
