import {Checkbox, Stack} from "@mantine/core";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doBooleanToggle} from "../state/params/actions";
import {selectBooleans} from "../state/params/selectors";
import {selectServerBooleansEnabled} from "../state/server/selectors";
import {LayoutParamsArea} from "./LayoutParamsArea";
import {PaginationInput} from "./PaginationInput";
import {SortingInput} from "./SortingInput";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
export const AreaOptions = () => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const booleans = useSelector(selectBooleans);
  const enabledBooleans = useSelector(selectServerBooleansEnabled);

  return (
    <LayoutParamsArea
      title={t("params.title_area_options")}
      tooltip={t("params.tooltip_area_options")}
      value="options"
    >
      <Stack spacing="xs">
        <Stack spacing="xs">
          {enabledBooleans.map(key =>
            <Checkbox
              key={key}
              label={t(`params.label_boolean_${key}`)}
              checked={booleans[key] || false}
              onChange={() => {
                dispatch(doBooleanToggle(key));
              }}
            />
          )}
        </Stack>
        <SortingInput />
        <PaginationInput />
      </Stack>
    </LayoutParamsArea>
  );
};
