import {Button, Classes, Divider, Icon, Intent, Tabs} from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";
import ScrollArea from "react-shadow-scroll";
import {IconTooltip} from "./Tooltips";

const stopBubbling = evt => {
  evt.stopPropagation();
  evt.preventDefault();
};

/**
 * @typedef OwnProps
 * @property {boolean} [open]
 * @property {string} [className]
 * @property {string} title
 * @property {React.ReactNode} [toolbar]
 * @property {string} [tooltip]
 * @property {string} [warning]
 * @property {string} [maxHeight]
 */

/** @type {React.FC<OwnProps>} */
export const LayoutParamsArea = props => {
  const {tooltip, warning} = props;
  return (
    <details className={classNames("query-area relative", props.className)} open={props.open}>
      <summary className={classNames("details-title flex flex-row flex-nowrap items-center p-0", Classes.ELEVATION_0)}>
        <Icon className="icon-chevron" icon="chevron-right" />
        <span className="title block pr-2">{props.title}</span>
        {tooltip && <IconTooltip tooltipText={tooltip} icon="info-sign" />}
        <Tabs.Expander />
        <span
          className={classNames(Classes.BUTTON_GROUP, Classes.MINIMAL)}
          onClick={stopBubbling}
        >
          {props.toolbar}
          {warning && <Divider />}
          {warning && <Button disabled intent={Intent.WARNING} icon="warning-sign" />}
        </span>
      </summary>
      <ScrollArea isShadow={false}>
        <div className="p-3" style={{maxHeight: props.maxHeight}}>{props.children}</div>
      </ScrollArea>
    </details>
  );
};
