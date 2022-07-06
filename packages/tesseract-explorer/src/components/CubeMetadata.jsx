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
    <p className={props.className}>
      {description}
    </p>
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
    <p className={props.className}>
      {srcName && <span className="block">
        {`${t("params.label_source")  }: `}
        {srcLink
          ? <a href={srcLink}>{srcName}</a>
          : <span>{srcName}</span>}
      </span>}
      {srcDescription && <span className="block">{srcDescription}</span>}
    </p>
  );
};

export const MemoCubeDescription = memo(CubeDescription);
export const MemoCubeSource = memo(CubeSource);
