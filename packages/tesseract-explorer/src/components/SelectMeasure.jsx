import {Alignment, Button, MenuItem} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import classNames from "classnames";
import React, {memo} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {selectOlapMeasureItems} from "../state/selectors";
import {safeRegExp} from "../utils/transform";
import {shallowEqualExceptFns} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {boolean} [fill]
 * @property {import("@blueprintjs/core").IconName | false} [icon]
 * @property {BlueprintSelect.ItemListPredicate<OlapClient.PlainMeasure>} [itemListPredicate]
 * @property {BlueprintSelect.ItemRenderer<OlapClient.PlainMeasure>} [itemRenderer]
 * @property {(item: OlapClient.PlainMeasure) => void} onItemSelect
 * @property {string} [placeholder]
 * @property {string | undefined} selectedItem
 * @property {boolean} [usePortal]
 */

/** @type {Required<Pick<OwnProps, "itemListPredicate" | "itemRenderer">>} */
const defaultProps = {
  itemListPredicate(query, items) {
    const tester = safeRegExp(query, "i");
    return items.filter(item => tester.test(item.caption || item.name));
  },
  itemRenderer(item, {handleClick, modifiers}) {
    return (
      <MenuItem
        active={modifiers.active}
        icon="th-list"
        key={item.uri}
        onClick={handleClick}
        text={item.caption}
      />
    );
  }
};

/** @type {React.FC<OwnProps>} */
export const SelectMeasure = props => {
  const {fill, usePortal} = props;

  const {translate: t} = useTranslation();

  const items = useSelector(selectOlapMeasureItems);

  return (
    <Select
      className={classNames("select-measure", props.className)}
      filterable={items.length > 6}
      itemListPredicate={props.itemListPredicate || defaultProps.itemListPredicate}
      itemRenderer={props.itemRenderer || defaultProps.itemRenderer}
      items={items}
      onItemSelect={props.onItemSelect}
      popoverProps={{fill, minimal: true, usePortal, portalClassName: "select-measure-overlay"}}
    >
      <Button
        alignText={Alignment.LEFT}
        className={props.className}
        fill={fill}
        icon={props.icon}
        rightIcon="double-caret-vertical"
        text={props.selectedItem || t("selectmeasure_placeholder")}
      />
    </Select>
  );
};

SelectMeasure.defaultProps = defaultProps;

export const MemoSelectMeasure = memo(SelectMeasure, shallowEqualExceptFns);
