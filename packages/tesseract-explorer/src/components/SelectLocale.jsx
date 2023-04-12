import {Box, Input} from "@mantine/core";
import React from "react";
import {useSelector} from "react-redux";
import {useActions} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectLocale} from "../state/queries";
import {selectLocaleOptions} from "../state/server";
import {SelectObject} from "./Select";

/** @type {React.FC<import("./Select").SelectObjectProps<{label: string, value: string}>>} */
const SelectLocaleOptions = SelectObject;

export const SelectLocale = () => {
  const actions = useActions();

  const {translate: t} = useTranslation();

  const currentLocale = useSelector(selectLocale);
  const localeOptions = useSelector(selectLocaleOptions);


  if (localeOptions.length < 2) {
    return null;
  }

  return (
    <Box id="select-locale">
      <Input.Wrapper label={t("params.label_locale")}>
        <SelectLocaleOptions
          getLabel={item => item.label}
          getKey={item => item.value}
          items={localeOptions}
          onItemSelect={locale => {
            if (currentLocale.code !== locale.value) {
              actions.updateLocale(locale.value);
            }
          }}
          selectedItem={currentLocale.code}
        />
      </Input.Wrapper>
    </Box>
  );
};
