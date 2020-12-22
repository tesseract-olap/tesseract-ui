import classNames from "classnames";
import React, {useState} from "react";
import ReactShadowScroll from "react-shadow-scroll";

import {Button} from "@blueprintjs/core";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {boolean} [defaultOpen]
 * @property {string} title
 */

/** @type {React.FC<OwnProps>} */
export const ExplorerColumn = props => {

  const {
    defaultOpen: initialOpenState = true,
    title
  } = props;

  const [isOpen, setOpen] = useState(initialOpenState);

  const toggleHandler = () => setOpen(!isOpen);

  if (!isOpen) {
    return (
      <div className={classNames("explorer-column closed", props.className)}>
        <div className="titlebar">
          <Button className="open-toggle" icon="menu-open" minimal onClick={toggleHandler} />
          { title ? <h2 className="token">{title}</h2> : null }
        </div>
      </div>
    );
  }

  return (
    <div className={classNames("explorer-column", props.className)}>
      <div className="titlebar">
        { title ? <h2 className="token">{title}</h2> : null }
        <Button className="open-toggle" icon="menu-closed" minimal onClick={toggleHandler} />
      </div>
      <ReactShadowScroll isShadow={false}>
        <div className={`wrapper ${props.className}-content`}>{props.children}</div>
      </ReactShadowScroll>
    </div>
  );
};
