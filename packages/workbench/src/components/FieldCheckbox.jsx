import clsx from "clsx";
import React, {useCallback} from "react";
import {FieldArea} from "./FieldArea";

/**
 * @typedef FieldCheckboxProps
 * @property {string} [className]
 * @property {string} name
 * @property {boolean} value
 * @property {(value: string) => void} onChange
 */

/** @type {React.FC<FieldCheckboxProps>} */
export const FieldCheckbox = props => {
  const {onChange} = props;

  const fieldName = `field-${props.name}`;

  const onChangeHandler = useCallback(evt => {
    typeof onChange === "function" && onChange(evt.target.checked);
  }, [onChange]);

  return (
    <FieldArea
      className={clsx("field-checkbox", props.className)}
      label={props.name}
      inputName={fieldName}
    >
      <input
        type="checkbox"
        name={fieldName}
        checked={props.value}
        onChange={onChangeHandler}
      />
    </FieldArea>
  );
};
