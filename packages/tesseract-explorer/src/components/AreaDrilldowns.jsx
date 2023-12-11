import {ActionIcon, Alert, Stack} from "@mantine/core";
import {IconAlertCircle, IconCirclePlus, IconTrashX} from "@tabler/icons-react";
import React, {useCallback} from "react";
import {useSelector} from "react-redux";
import {useActions} from "../hooks/settings";
import {useTranslation} from "../hooks/translation";
import {selectDrilldownItems} from "../state/queries";
import {selectOlapDimensionItems} from "../state/selectors";
import {buildDrilldown} from "../utils/structs";
import {activeItemCounter} from "../utils/validation";
import {ButtonSelectLevel} from "./ButtonSelectLevel";
import {LayoutParamsArea} from "./LayoutParamsArea";
import TagDrilldown from "./TagDrilldown";

/** @type {React.FC} */
export const AreaDrilldowns = () => {
  const actions = useActions();

  const {translate: t} = useTranslation();

  const items = useSelector(selectDrilldownItems);
  const dimensions = useSelector(selectOlapDimensionItems);

  /** @type {() => void} */
  const clearHandler = useCallback(() => {
    actions.resetDrilldowns({});
  }, []);

  /** @type {(level: import("@datawheel/olap-client").PlainLevel) => void} */
  const createHandler = useCallback(level => {
    const drilldownItem = buildDrilldown(level);
    actions.updateDrilldown(drilldownItem);
    actions.willFetchMembers({...level, level: level.name})
      .then(members => {
        const dimension = dimensions.find(dim => dim.name === level.dimension);
        if (!dimension) return;
        actions.updateDrilldown({
          ...drilldownItem,
          dimType: dimension.dimensionType,
          memberCount: members.length
        });
      });
  }, [dimensions]);

  /** @type {(item: import("../utils/structs").DrilldownItem) => void} */
  const removeHandler = item => {
    actions.removeDrilldown(item.key);
  };

  /** @type {(item: import("../utils/structs").DrilldownItem) => void} */
  const toggleHandler = item => {
    actions.updateDrilldown({...item, active: !item.active});
  };

  /** @type {(item: import("../utils/structs").DrilldownItem, caption: string) => void} */
  const updateCaptionHandler = (item, captionProperty) => {
    actions.updateDrilldown({...item, captionProperty});
  };

  /** @type {(item: import("../utils/structs").DrilldownItem, props: import("../utils/structs").PropertyItem[]) => void} */
  const updatePropertiesHandler = (item, properties) => {
    actions.updateDrilldown({...item, properties});
  };

  const toolbar =
    <>
      {items.length > 0 &&
        <ActionIcon onClick={clearHandler} variant="subtle">
          <IconTrashX />
        </ActionIcon>
      }
      <ButtonSelectLevel
        onItemSelect={createHandler}
        selectedItems={items}
        variant="subtle"
      >
        <IconCirclePlus />
      </ButtonSelectLevel>
    </>;

  return (
    <LayoutParamsArea
      id="drilldowns"
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
