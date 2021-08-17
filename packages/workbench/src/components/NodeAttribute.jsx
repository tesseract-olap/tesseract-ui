import clsx from "clsx";
import React, {useCallback, useState} from "react";
import { FieldText } from "./FieldText";

/**
 * @typedef NodeAttributeProps
 * @property {string} [className]
 * @property {string} name
 * @property {string} value
 * @property {(value: string) => void} onChange
 */

/** @type {React.FC<NodeAttributeProps>} */
export const NodeAttribute = props => {



  return <FieldText
    className="blueprint-nodeattr"
    name={props.name}
    value={props.value}
    onChange={onChangeHandler}
  />;
};
