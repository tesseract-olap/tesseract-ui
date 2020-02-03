import classNames from "classnames";
import React, {useState} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {boolean} [defaultOpen]
 * @property {string} title
 */

/** @type {React.FC<OwnProps>} */
const ExplorerColumn = function(props) {
  const {defaultOpen: initialOpenState = true} = props;
  const [isOpen, setOpen] = useState(initialOpenState);

  const toggleHandler = () => setOpen(!isOpen);

  if (!isOpen) {
    return (
      <div className={classNames("explorer-column closed", props.className)}>
        <div className="titlebar">
          <h2 className="token" onClick={toggleHandler}>
            {props.title}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames("explorer-column", props.className)}>
      <div className="titlebar">
        <h2 className="token" onClick={toggleHandler}>
          {props.title}
        </h2>
      </div>
      <PerfectScrollbar>
        <div className={`wrapper ${props.className}-content`}>{props.children}</div>
      </PerfectScrollbar>
    </div>
  );
};

export default ExplorerColumn;
