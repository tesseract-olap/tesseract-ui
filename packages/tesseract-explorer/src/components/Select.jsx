import {Alignment, Button, MenuItem} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import classNames from "classnames";
import React from "react";
import {useTranslation} from "../hooks/translation";
import {safeRegExp} from "../utils/transform";

/** @type {import("@blueprintjs/select").ItemListPredicate<string | number | boolean>} */
export const primitiveItemListPredicate = (query, items) => {
  const tester = safeRegExp(query, "i");
  return items.filter(item => tester.test(item.toString()));
};

/** @type {import("@blueprintjs/select").ItemRenderer<string | number | boolean>} */
export const primitiveItemRenderer = (item, itemProps) => {
  const {modifiers} = itemProps;
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={item.toString()}
      onClick={itemProps.handleClick}
      text={item.toString()}
    />
  );
};

/**
 * @typedef SelectPrimitiveProps
 * @property {string} [className]
 * @property {boolean} [fill]
 * @property {boolean} [filterable]
 * @property {import("@blueprintjs/core").IconName | import("@blueprintjs/core").MaybeElement} [icon]
 * @property {import("@blueprintjs/select").ItemListPredicate<any>} [itemListPredicate]
 * @property {import("@blueprintjs/select").ItemListRenderer<any>} [itemListRenderer]
 * @property {import("@blueprintjs/select").ItemRenderer<any>} [itemRenderer]
 * @property {any[]} items
 * @property {boolean} [loading]
 * @property {boolean} [minimal]
 * @property {(item: any, event?: React.SyntheticEvent<HTMLElement>) => void} onItemSelect
 * @property {import("@blueprintjs/core").IconName | import("@blueprintjs/core").MaybeElement} [rightIcon]
 * @property {string | undefined} selectedItem
 */

/** @type {React.FC<SelectPrimitiveProps>} */
export const SelectPrimitive = props => {
  const {translate: t} = useTranslation();

  return (
    <Select
      className={classNames("select-primitive", props.className)}
      itemListPredicate={props.itemListPredicate || primitiveItemListPredicate}
      itemListRenderer={props.itemListRenderer}
      itemRenderer={props.itemRenderer || primitiveItemRenderer}
      items={props.items}
      filterable={props.filterable ?? props.items.length > 6}
      onItemSelect={props.onItemSelect}
      popoverProps={{
        boundary: "viewport",
        fill: props.fill,
        minimal: props.minimal,
        captureDismiss: true,
        portalClassName: classNames("select-primitive-overlay", props.className)
      }}
    >
      <Button
        alignText={Alignment.LEFT}
        className={classNames("select-primitive-target", props.className)}
        fill={props.fill}
        loading={props.loading}
        icon={props.icon}
        rightIcon={props.rightIcon}
        text={props.selectedItem ?? t("placeholders.unselected")}
      />
    </Select>
  );
};

SelectPrimitive.defaultProps = {
  fill: false,
  loading: false,
  minimal: true,
  rightIcon: "double-caret-vertical"
};

/**
 * @template T
 * @typedef SelectObjectProps
 * @property {string} [className]
 * @property {boolean} [fill]
 * @property {boolean} [filterable]
 * @property {(item: T) => string} getLabel
 * @property {import("@blueprintjs/core").IconName | import("@blueprintjs/core").MaybeElement} [icon]
 * @property {import("@blueprintjs/select").ItemListPredicate<T>} [itemListPredicate]
 * @property {import("@blueprintjs/select").ItemListRenderer<T>} [itemListRenderer]
 * @property {import("@blueprintjs/select").ItemRenderer<T>} [itemRenderer]
 * @property {T[]} items
 * @property {boolean} [loading]
 * @property {boolean} [minimal]
 * @property {(item: T, event?: React.SyntheticEvent<HTMLElement>) => void} onItemSelect
 * @property {import("@blueprintjs/core").IconName | import("@blueprintjs/core").MaybeElement} [rightIcon]
 * @property {string | undefined} selectedItem
 */

/**
 * @type {React.FC<SelectObjectProps<any>>}
 */
export const SelectObject = props => {
  const {getLabel} = props;
  return (
    <SelectPrimitive
      className={props.className}
      fill={props.fill}
      filterable={props.filterable}
      loading={props.loading}
      minimal={props.minimal}
      icon={props.icon}
      rightIcon={props.rightIcon}
      items={props.items}
      itemListPredicate={(query, items) => {
        const tester = safeRegExp(query, "i");
        return items.filter(item => tester.test(getLabel(item)));
      }}
      itemListRenderer={props.itemListRenderer}
      itemRenderer={(item, itemProps) => {
        const {modifiers} = itemProps;
        const label = getLabel(item);
        return (
          <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            key={label}
            onClick={itemProps.handleClick}
            text={label}
          />
        );
      }}
      onItemSelect={props.onItemSelect}
      selectedItem={props.selectedItem}
    />
  );
};
