import React, {Children} from "react";
import clsx from "clsx";

/**
 * @typedef DetailsBaseProps
 * @property {string} [className]
 */

/** @type {React.FC<DetailsBaseProps>} */
export const DetailsBase = props => {
  const {} = props;

  return (
    <div className={clsx("blueprint-details", props.className)}>
      {children}
    </div>
  );
};
