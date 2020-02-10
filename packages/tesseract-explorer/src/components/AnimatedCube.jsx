import React from "react";
import classNames from "classnames";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
const AnimatedCube = props =>
  <div className={classNames("animated-cube", props.className)}>
    <div className="cube">
      <span />
      <span />
      <span />
    </div>
    <div className="cube">
      <span />
      <span />
      <span />
    </div>
  </div>;

export default AnimatedCube;
