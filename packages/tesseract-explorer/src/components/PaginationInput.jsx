import {ButtonGroup, Divider, FormGroup, NumericInput} from "@blueprintjs/core";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doPaginationUpdate} from "../state/params/actions";
import {selectPaginationParams, selectBooleans} from "../state/params/selectors";

/**
 * @typedef PaginationInputProps
 * @property {string} [className]
 */

/** @type {React.FC<PaginationInputProps>} */
export const PaginationInput = () => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const {limit, offset} = useSelector(selectPaginationParams);

  const {full_results} = useSelector(selectBooleans);

  return (
    <ButtonGroup fill={true}>
      <FormGroup label={t("params.label_pagination_limit")}>
        <NumericInput
          disabled={!full_results}
          fill={true}
          min={0}
          onValueChange={limit => dispatch(doPaginationUpdate(limit, offset))}
          value={limit}
        />
      </FormGroup>

      <Divider />

      <FormGroup label={t("params.label_pagination_offset")}>
        <NumericInput
          disabled={!full_results}
          fill={true}
          min={0}
          onValueChange={offset => dispatch(doPaginationUpdate(limit, offset))}
          value={offset}
        />
      </FormGroup>
    </ButtonGroup>
  );
};
