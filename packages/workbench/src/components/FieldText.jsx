import clsx from "clsx";
import React, {useCallback} from "react";
import {FieldArea} from "./FieldArea";

/**
 * @typedef FieldTextProps
 * @property {string} [className]
 * @property {string} name
 * @property {string} value
 * @property {(value: string) => void} onChange
 */

/** @type {React.FC<FieldTextProps>} */
export const FieldText = props => {
  const {onChange} = props;

  const fieldName = `field-${props.name}`;

  const onChangeHandler = useCallback(evt => {
    typeof onChange === "function" && onChange(evt.target.value);
  }, [onChange]);

  return (
    <FieldArea
      className={clsx("field-text", props.className)}
      label={props.name}
      inputName={fieldName}
    >
      <input
        type="text"
        name={fieldName}
        value={props.value}
        onChange={onChangeHandler}
      />
    </FieldArea>
  );
};
