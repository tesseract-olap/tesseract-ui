import {Alignment, Button, Intent, Tag} from "@blueprintjs/core";
import classNames from "classnames";
import React, {memo} from "react";
import {isActiveItem, shallowEqualExceptFns} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {boolean} active
 * @property {string} [className]
 * @property {QueryItem} item
 * @property {(event: React.MouseEvent<HTMLElement>) => void} [onClick]
 */

/** @type {React.FC<OwnProps>} */
export const StoredQuery = ({active, className, item, onClick}) => {
  const {params} = item;

  const levelList = Object.values(params.drilldowns)
    .filter(isActiveItem)
    .map(item => item.level);
  const measureList = Object.values(params.measures)
    .filter(isActiveItem)
    .map(item => item.measure);

  return (
    <Button
      alignText={params.cube ? Alignment.LEFT : undefined}
      className={classNames(className)}
      fill
      intent={active ? Intent.PRIMARY : Intent.NONE}
      onClick={onClick}
      tabIndex={0}
    >
      {params.cube && <Tag fill icon="cube">{params.cube}</Tag>}
      {measureList.length > 0 && <Tag fill icon="th-list">{measureList.join(", ")}</Tag>}
      {levelList.length > 0 && <Tag fill icon="layers">{levelList.join(", ")}</Tag>}
      {!params.cube && "No parameters set"}
    </Button>
  );
};

export const MemoStoredQuery = memo(StoredQuery, shallowEqualExceptFns);
