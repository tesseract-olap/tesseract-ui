import {Checkbox, Stack} from "@mantine/core";
import React from "react";
import {useActions} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectBooleans} from "../state/queries";
import {selectServerBooleansEnabled} from "../state/server";
import {useSelector} from "../state/store";
import {LayoutParamsArea} from "./LayoutParamsArea";
import {PaginationInput} from "./PaginationInput";
import {SortingInput} from "./SortingInput";

export const AreaOptions = () => {
  const actions = useActions();

  const {translate: t} = useTranslation();

  const booleans = useSelector(selectBooleans);
  const enabledBooleans = useSelector(selectServerBooleansEnabled);

  return (
    <LayoutParamsArea
      id="options"
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
                actions.updateBoolean({key});
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
