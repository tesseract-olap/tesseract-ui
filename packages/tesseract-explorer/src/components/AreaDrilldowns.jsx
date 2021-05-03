import {Button, Intent} from "@blueprintjs/core";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {doDrilldownClear, doDrilldownRemove, doDrilldownUpdate} from "../state/params/actions";
import {selectDrilldownItems} from "../state/params/selectors";
import {buildDrilldown} from "../utils/structs";
import {activeItemCounter} from "../utils/validation";
import {MemoButtonSelectLevel as ButtonSelectLevel} from "./ButtonSelectLevel";
import {LayoutParamsArea} from "./LayoutParamsArea";
import TagDrilldown from "./TagDrilldown";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/** @type {React.FC<OwnProps>} */
export const AreaDrilldowns = props => {
  const dispatch = useDispatch();

  const {translate: t} = useTranslation();

  const items = useSelector(selectDrilldownItems);

  /** @type {() => void} */
  const clearHandler = () => {
    dispatch(doDrilldownClear());
  };

  /** @type {(level: OlapClient.PlainLevel, hierarchy: OlapClient.PlainHierarchy, dimension: OlapClient.PlainDimension) => any} */
  const createHandler = (level, hierarchy, dimension) => {
    const drilldownItem = buildDrilldown({...level, dimType: dimension.dimensionType});
    dispatch(doDrilldownUpdate(drilldownItem));
  };

  /** @type {(item: TessExpl.Struct.DrilldownItem) => void} */
  const removeHandler = item => {
    dispatch(doDrilldownRemove(item.key));
  };

  /** @type {(item: TessExpl.Struct.DrilldownItem) => void} */
  const toggleHandler = item => {
    dispatch(doDrilldownUpdate({...item, active: !item.active}));
  };

  /** @type {(item: TessExpl.Struct.DrilldownItem, caption: string) => void} */
  const updateCaptionHandler = (item, captionProperty) => {
    dispatch(doDrilldownUpdate({...item, captionProperty}));
  };

  /** @type {(item: TessExpl.Struct.DrilldownItem, props: TessExpl.Struct.PropertyItem[]) => void} */
  const updatePropertiesHandler = (item, properties) => {
    dispatch(doDrilldownUpdate({...item, properties}));
  };

  const toolbar =
    <React.Fragment>
      {items.length > 0 &&
        <Button icon="trash" intent={Intent.DANGER} onClick={clearHandler} />
      }
      <ButtonSelectLevel
        icon="new-object"
        onItemSelect={createHandler}
        selectedItems={items}
      />
    </React.Fragment>;

  return (
    <LayoutParamsArea
      className={props.className}
      open={true}
      title={t("params.title_area_drilldowns", {n: `${items.reduce(activeItemCounter, 0)}`})}
      toolbar={toolbar}
      tooltip={t("params.tooltip_area_drilldowns")}
    >
      {items.map(item =>
        <TagDrilldown
          key={item.key}
          item={item}
          onRemove={removeHandler}
          onToggle={toggleHandler}
          onCaptionUpdate={updateCaptionHandler}
          onPropertiesUpdate={updatePropertiesHandler}
        />
      )}
    </LayoutParamsArea>
  );
};
