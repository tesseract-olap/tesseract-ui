import {Button, Intent} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import ButtonSelectLevel from "../components/ButtonSelectLevel";
import QueryArea from "../components/QueryArea";
import TagDrilldown from "../components/TagDrilldown";
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
 * @property {DrilldownItem[]} items
 */

/**
 * @typedef DispatchProps
 * @property {() => void} clearHandler
 * @property {(level: OlapLevel, hierarchy: OlapHierarchy, dimension: OlapDimension) => any} createHandler
 * @property {(item: DrilldownItem) => void} removeHandler
 * @property {(item: DrilldownItem) => void} toggleHandler
 * @property {(item: DrilldownItem, caption: string) => void} updateCaptionHandler
 * @property {(item: DrilldownItem, props: PropertyItem[]) => void} updatePropertiesHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const QueryDrilldowns = props => {
  const {items} = props;
  const totalCount = items.length;
  const activeCount = items.reduce(activeItemCounter, 0);

  const title = `Drilldowns (${activeCount})`;
  const toolbar =
    <React.Fragment>
      {totalCount > 0 &&
        <Button icon="trash" intent={Intent.DANGER} onClick={props.clearHandler} />
      }
      <ButtonSelectLevel
        icon="new-object"
        onItemSelect={props.createHandler}
        selectedItems={items}
      />
    </React.Fragment>;

  return (
    <QueryArea className={props.className} title={title} toolbar={toolbar}>
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

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  items: selectDrilldownItems(state)
});

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
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
