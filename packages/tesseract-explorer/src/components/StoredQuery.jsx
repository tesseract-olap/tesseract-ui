import {Alignment, Button, Intent, Tag} from "@blueprintjs/core";
import classNames from "classnames";
import React, {memo} from "react";
import {useTranslation} from "../hooks/translation";
import {isActiveItem, shallowEqualExceptFns} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {boolean} active
 * @property {string} [className]
 * @property {TessExpl.Struct.QueryItem} item
 * @property {(event: React.MouseEvent<HTMLElement>) => void} [onClick]
 */

/** @type {React.FC<OwnProps>} */
export const StoredQuery = props => {
  const {params} = props.item;
  const {translate: t} = useTranslation();

  const levelList = Object.values(params.drilldowns)
    .filter(isActiveItem)
    .map(item => item.level);
  const measureList = Object.values(params.measures)
    .filter(isActiveItem)
    .map(item => item.measure);

  return (
    <Button
      alignText={params.cube ? Alignment.LEFT : undefined}
      className={classNames(props.className)}
      fill
      intent={props.active ? Intent.PRIMARY : Intent.NONE}
      onClick={props.onClick}
      tabIndex={0}
    >
      {params.cube && <Tag fill icon="cube">{params.cube}</Tag>}
      {measureList.length > 0 && <Tag fill icon="th-list">{measureList.join(", ")}</Tag>}
      {levelList.length > 0 && <Tag fill icon="layers">{levelList.join(", ")}</Tag>}
      {!params.cube && t("queries.unset_parameters")}
    </Button>
  );
};

export const MemoStoredQuery = memo(StoredQuery, shallowEqualExceptFns);
