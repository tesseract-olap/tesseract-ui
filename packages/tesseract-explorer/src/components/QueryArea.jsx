import {Button, ButtonGroup, Divider, Icon, Intent} from "@blueprintjs/core";
import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import classNames from "classnames";

/**
 * @typedef OwnProps
 * @property {boolean} [open]
 * @property {string} [className]
 * @property {string} title
 * @property {React.ReactNode} [toolbar]
 * @property {string} [warning]
 * @property {() => void} [stopBubbling]
 */

/** @type {React.FC<OwnProps>} */
const QueryArea = ({children, className, open = true, stopBubbling, title, toolbar, warning}) =>
  <details className={classNames("query-area", className)} open={open}>
    <summary className="details-title">
      <Icon className="icon-chevron" icon="chevron-right" />
      <span className="title">{title}</span>
      <ButtonGroup minimal onClick={stopBubbling}>
        {toolbar}
        {warning && <Divider />}
        {warning && <Button disabled intent={Intent.WARNING} icon="warning-sign" />}
      </ButtonGroup>
    </summary>
    <PerfectScrollbar className="details-content">{children}</PerfectScrollbar>
  </details>;

QueryArea.defaultProps = {
  stopBubbling(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  }
};

export default QueryArea;
