import React from "react";
import classNames from "classnames";

interface OwnProps {
  className?: string;
}

const AnimatedCube: React.FC<OwnProps> = (props) => (
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
  </div>
)

export default AnimatedCube;
