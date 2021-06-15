import classNames from "classnames";
import React, {useState} from "react";
import ReactShadowScroll from "react-shadow-scroll";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {boolean} [defaultOpen]
 * @property {string} title
 */

/** @type {React.FC<OwnProps>} */
export const LayoutColumn = props => {
  const {defaultOpen: initialOpenState = true} = props;
  const [isOpen, setOpen] = useState(initialOpenState);

  const toggleHandler = () => setOpen(!isOpen);

  if (!isOpen) {
    return (
      <div className={classNames("explorer-column closed bp3-elevation-0", props.className)}>
        <div className="titlebar">
          <h2 className="token" onClick={toggleHandler}>
            {props.title}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames("explorer-column bp3-elevation-0 flex flex-col flex-nowrap", props.className)}>
      <div className="titlebar">
        <h2 className="token" onClick={toggleHandler}>
          {props.title}
        </h2>
      </div>
      <ReactShadowScroll isShadow={false}>
        <div className={`wrapper ${props.className}-content`}>{props.children}</div>
      </ReactShadowScroll>
    </div>
  );
};
