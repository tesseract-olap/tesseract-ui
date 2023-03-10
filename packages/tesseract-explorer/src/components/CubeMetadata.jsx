import {Anchor, Box, Text} from "@mantine/core";
import React, {memo} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {selectLocale} from "../state/params/selectors";
import {getAnnotation} from "../utils/string";

/**
 * @typedef CubeDescriptionProps
 * @property {string} [className]
 * @property {{annotations: any}} cube
 */

/** @type {React.FC<CubeDescriptionProps>} */
export const CubeDescription = props => {
  const {cube} = props;
  const {code: localeCode} = useSelector(selectLocale);

  const description = getAnnotation(cube, "description", localeCode);

  if (!description) return null;

  return (
    <Text>
      {description}
    </Text>
  );
};

export const CubeSource = props => {
  const {cube} = props;
  const {code: locale} = useSelector(selectLocale);
  const {translate: t} = useTranslation();

  const srcName = getAnnotation(cube, "source_name", locale);
  const srcLink = getAnnotation(cube, "source_link", locale);
  const srcDescription = getAnnotation(cube, "source_description", locale);

  if (!srcName && !srcDescription) return null;

  return (
    <Box pt="sm">
      {srcName && <Text fz="xs">
        {`${t("params.label_source")  }: `}
        {srcLink
          ? <Anchor href={srcLink} span>{srcName}</Anchor>
          : <Text span>{srcName}</Text>}
      </Text>}
      {srcDescription && <Text fz="xs">{srcDescription}</Text>}
    </Box>
  );
};

export const MemoCubeDescription = memo(CubeDescription);
export const MemoCubeSource = memo(CubeSource);
