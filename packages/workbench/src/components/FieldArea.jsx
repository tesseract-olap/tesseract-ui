import clsx from "clsx";
import React from "react";

/**
 * @typedef FieldAreaProps
 * @property {string} [className]
 * @property {string} label
 * @property {string} inputName
 */

/** @type {React.FC<FieldAreaProps>} */
export const FieldArea = props => {
  return (
    <div className={clsx("blueprint-field", props.className)}>
      <label htmlFor={fieldName}>{props.name}</label>
      <div className="field-input">{props.children}</div>
    </div>
  );
};
