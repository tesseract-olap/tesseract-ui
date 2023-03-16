import {Box, Input} from "@mantine/core";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doLocaleUpdate} from "../state/params/actions";
import {selectLocale} from "../state/params/selectors";
import {selectLocaleOptions} from "../state/server/selectors";
import {SelectObject} from "./Select";

/** @type {React.FC<import("./Select").SelectObjectProps<{label: string, value: string}>>} */
const SelectLocaleOptions = SelectObject;

export const SelectLocale = () => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const currentLocale = useSelector(selectLocale);
  const localeOptions = useSelector(selectLocaleOptions);


  if (localeOptions.length < 2) {
    return null;
  }

  return (
    <Box>
      <Input.Wrapper label={t("params.label_locale")}>
        <SelectLocaleOptions
          getLabel={item => item.label}
          getKey={item => item.value}
          items={localeOptions}
          onItemSelect={locale => {
            if (currentLocale.code !== locale.value) {
              dispatch(doLocaleUpdate(locale.value));
            }
          }}
          selectedItem={currentLocale.code}
        />
      </Input.Wrapper>
    </Box>
  );
};
