import {Alignment, Button, ButtonGroup, Icon, Intent} from "@blueprintjs/core";
import classNames from "classnames";
import React, {memo} from "react";
import {useTranslation} from "../hooks/translation";
import {isActiveItem, shallowEqualExceptFns} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {boolean} active
 * @property {string} [className]
 * @property {boolean} [hideDelete]
 * @property {TessExpl.Struct.QueryItem} item
 * @property {(key: string) => void} [onSelect]
 * @property {(key: string) => void} [onDelete]
 */

/** @type {React.FC<OwnProps>} */
export const StoredQuery = props => {
  const {onSelect, onDelete} = props;
  const {params} = props.item;
  const {translate: t} = useTranslation();

  const levelList = Object.values(params.drilldowns)
    .filter(isActiveItem)
    .map(item => item.level);
  const measureList = Object.values(params.measures)
    .filter(isActiveItem)
    .map(item => item.measure);

  return (
    <ButtonGroup className={classNames("my-2", props.className)} fill>
      <Button
        alignText={params.cube ? Alignment.LEFT : undefined}
        className="px-2"
        fill
        intent={props.active ? Intent.PRIMARY : Intent.NONE}
        onClick={() => onSelect && onSelect(props.item.key)}
        tabIndex={0}
      >
        <div className="flex flex-col text-xs">
          {params.cube && <IconSpan icon="cube" text={params.cube} />}
          {measureList.length > 0 && <IconSpan icon="th-list" text={measureList.join(", ")} />}
          {levelList.length > 0 && <IconSpan icon="layers" text={levelList.join(", ")} />}
          {!params.cube && <span>{t("queries.unset_parameters")}</span>}
        </div>
      </Button>

      {!props.hideDelete && <Button
        icon="trash"
        onClick={() => onDelete && onDelete(props.item.key)}
      />}
    </ButtonGroup>
  );
};

const IconSpan = props =>
  <span className="flex flex-row items-center">
    {props.icon && <Icon iconSize={12} icon={props.icon} />}
    <span className="ml-1 flex-grow">{props.text}</span>
  </span>;

export const MemoStoredQuery = memo(StoredQuery, shallowEqualExceptFns);
