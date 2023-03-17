import {Alert, Group, Stack, ThemeIcon} from "@mantine/core";
import {IconAlertCircle, IconCirclePlus, IconTrashX} from "@tabler/icons-react";
import React, {useCallback} from "react";
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

/** @type {React.FC} */
export const AreaDrilldowns = () => {
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
    <Group noWrap spacing="xs">
      {items.length > 0 &&
        <ThemeIcon
          color="red"
          onClick={clearHandler}
          variant="light"
        >
          <IconTrashX />
        </ThemeIcon>
      }
      <ButtonSelectLevel
        color="blue"
        onItemSelect={createHandler}
        selectedItems={items}
        variant="light"
      >
        <IconCirclePlus />
      </ButtonSelectLevel>
    </Group>;

  return (
    <LayoutParamsArea
      title={t("params.title_area_drilldowns", {n: `${items.reduce(activeItemCounter, 0)}`})}
      toolbar={toolbar}
      tooltip={t("params.tooltip_area_drilldowns")}
      value="drilldowns"
    >
      <Stack spacing="xs">
        {items.length === 0 && <Alert
          color="yellow"
          icon={<IconAlertCircle size="2rem" />}
          title={t("params.error_no_dimension_selected_title")}
        >{t("params.error_no_dimension_selected_detail")}</Alert>}
        {items.length > 0 && items.map(item =>
          <TagDrilldown
            key={item.key}
            item={item}
            onRemove={removeHandler}
            onToggle={toggleHandler}
            onCaptionUpdate={updateCaptionHandler}
            onPropertiesUpdate={updatePropertiesHandler}
          />
        )}
      </Stack>
    </LayoutParamsArea>
  );
};
