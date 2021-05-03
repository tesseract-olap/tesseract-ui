import {ButtonGroup, Divider, FormGroup, NumericInput} from "@blueprintjs/core";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doPaginationUpdate} from "../state/params/actions";
import {selectPaginationParams} from "../state/params/selectors";

/**
 * @typedef PaginationInputProps
 * @property {string} [className]
 */

/** @type {React.FC<PaginationInputProps>} */
export const PaginationInput = () => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const {limit, offset} = useSelector(selectPaginationParams);

  return (
    <ButtonGroup fill={true}>
      <FormGroup label={t("params.label_pagination_limit")}>
        <NumericInput
          fill={true}
          onValueChange={limit => dispatch(doPaginationUpdate(limit, offset))}
          value={limit}
        />
      </FormGroup>

      <Divider />

      <FormGroup label={t("params.label_pagination_offset")}>
        <NumericInput
          fill={true}
          onValueChange={offset => dispatch(doPaginationUpdate(limit, offset))}
          value={offset}
        />
      </FormGroup>
    </ButtonGroup>
  );
};
