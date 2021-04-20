import {Button, Intent} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import ButtonSelectLevel from "../components/ButtonSelectLevel";
import {QueryArea} from "../components/QueryArea";
import TagDrilldown from "../components/TagDrilldown";
import {useTranslation} from "../hooks/translation";
import {doDrilldownClear, doDrilldownRemove, doDrilldownUpdate} from "../state/params/actions";
import {selectDrilldownItems} from "../state/params/selectors";
import {buildDrilldown} from "../utils/structs";
import {activeItemCounter} from "../utils/validation";

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {TessExpl.Struct.DrilldownItem[]} items
 */

/**
 * @typedef DispatchProps
 * @property {() => void} clearHandler
 * @property {(level: OlapClient.PlainLevel, hierarchy: OlapClient.PlainHierarchy, dimension: OlapClient.PlainDimension) => any} createHandler
 * @property {(item: TessExpl.Struct.DrilldownItem) => void} removeHandler
 * @property {(item: TessExpl.Struct.DrilldownItem) => void} toggleHandler
 * @property {(item: TessExpl.Struct.DrilldownItem, caption: string) => void} updateCaptionHandler
 * @property {(item: TessExpl.Struct.DrilldownItem, props: TessExpl.Struct.PropertyItem[]) => void} updatePropertiesHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const QueryDrilldowns = props => {
  const {items} = props;

  const {translate: t} = useTranslation();

  const toolbar =
    <React.Fragment>
      {items.length > 0 &&
        <Button icon="trash" intent={Intent.DANGER} onClick={props.clearHandler} />
      }
      <ButtonSelectLevel
        icon="new-object"
        onItemSelect={props.createHandler}
        selectedItems={items}
      />
    </React.Fragment>;

  return (
    <QueryArea
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
          onRemove={props.removeHandler}
          onToggle={props.toggleHandler}
          onCaptionUpdate={props.updateCaptionHandler}
          onPropertiesUpdate={props.updatePropertiesHandler}
        />
      )}
    </QueryArea>
  );
};

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  items: selectDrilldownItems(state)
});

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  clearHandler() {
    dispatch(doDrilldownClear());
  },
  createHandler(level, hierarchy, dimension) {
    const drilldownItem = buildDrilldown({...level, dimType: dimension.dimensionType});
    dispatch(doDrilldownUpdate(drilldownItem));
  },
  removeHandler(item) {
    dispatch(doDrilldownRemove(item.key));
  },
  toggleHandler(item) {
    dispatch(doDrilldownUpdate({...item, active: !item.active}));
  },
  updateCaptionHandler(item, captionProperty) {
    dispatch(doDrilldownUpdate({...item, captionProperty}));
  },
  updatePropertiesHandler(item, properties) {
    dispatch(doDrilldownUpdate({...item, properties}));
  }
});

export default connect(mapState, mapDispatch)(QueryDrilldowns);
