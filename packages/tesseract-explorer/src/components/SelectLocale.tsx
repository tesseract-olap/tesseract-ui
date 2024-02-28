import {Box, Input} from "@mantine/core";
import {LanguageCode} from "iso-639-1";
import React, {useCallback} from "react";
import {useSelector} from "react-redux";
import {useActions} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectLocale} from "../state/queries";
import {selectLocaleOptions} from "../state/server";
import {SelectObject} from "./Select";

type LocaleOptions = {label: string, value: LanguageCode};

/** */
export function SelectLocale() {
  const actions = useActions();

  const {translate: t} = useTranslation();

  const {code: currentCode} = useSelector(selectLocale);
  const localeOptions = useSelector(selectLocaleOptions);

  const localeChangeHandler = useCallback((locale: LocaleOptions) => {
    if (currentCode !== locale.value) {
      actions.updateLocale(locale.value);
    }
  }, [currentCode]);

  if (localeOptions.length < 2) {
    return null;
  }

  return (
    <Box id="select-locale">
      <Input.Wrapper label={t("params.label_locale")}>
        <SelectObject
          getLabel="label"
          getValue="value"
          items={localeOptions}
          onItemSelect={localeChangeHandler}
          selectedItem={currentCode}
        />
      </Input.Wrapper>
    </Box>
  );
}
