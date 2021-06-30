import {Button, Intent} from "@blueprintjs/core";
import React, {Fragment, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "../hooks/translation";
import {willFetchMembers} from "../middleware/olapActions";
import {doDrilldownClear, doDrilldownRemove, doDrilldownUpdate} from "../state/params/actions";
import {selectDrilldownItems} from "../state/params/selectors";
import {selectOlapDimensionItems} from "../state/selectors";
import {buildDrilldown} from "../utils/structs";
import {activeItemCounter} from "../utils/validation";
import {ButtonSelectLevel} from "./ButtonSelectLevel";
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
  const dimensions = useSelector(selectOlapDimensionItems);

  /** @type {() => void} */
  const clearHandler = useCallback(() => {
    dispatch(doDrilldownClear());
  }, []);

  /** @type {(level: OlapClient.PlainLevel) => void} */
  const createHandler = useCallback(level => {
    const drilldownItem = buildDrilldown(level);
    dispatch(doDrilldownUpdate(drilldownItem));
    dispatch(willFetchMembers(level))
      .then(members => {
        const dimension = dimensions.find(dim => dim.name === level.dimension);
        if (!dimension) return;
        dispatch(doDrilldownUpdate({
          ...drilldownItem,
          dimType: dimension.dimensionType,
          memberCount: members.length
        }));
      });
  }, [dimensions]);

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
    <Fragment>
      {items.length > 0 &&
        <Button icon="trash" intent={Intent.DANGER} onClick={clearHandler} />
      }
      <ButtonSelectLevel
        icon="new-object"
        onItemSelect={createHandler}
        selectedItems={items}
      />
    </Fragment>;

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
