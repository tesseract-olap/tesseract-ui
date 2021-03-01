import {Classes, Icon} from "@blueprintjs/core";
import React from "react";

/**
 * @typedef OwnProps
 * @property {(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void} [onClick]
 * @property {import("@blueprintjs/core").IconName} icon
 * @property {string} [title]
 */

/** @type {React.FC<OwnProps>} */
export const ButtonTagExtra = props =>
  <button type="button" title={props.title} className={Classes.TAG_REMOVE} onClick={props.onClick}>
    <Icon icon={props.icon} iconSize={Icon.SIZE_STANDARD} />
  </button>;
