import { Button, Intent } from "@blueprintjs/core";
import React from "react";
import { connect, MapStateToProps, MapDispatchToPropsFunction } from "react-redux";
import QueryArea from "../components/QueryArea";
import ButtonSelectLevel from "../components/ButtonSelectLevel";
import TagDrilldown from "../components/TagDrilldown";
import { doDrilldownClear, doDrilldownRemove, doDrilldownUpdate } from "../state/params/actions";
import { selectDrilldownItems } from "../state/params/selectors";
import { buildDrilldown } from "../utils/structs";
import { activeItemCounter } from "../utils/validation";

interface OwnProps {
  className?: string;
};

interface StateProps {
  items: DrilldownItem[];
};

interface DispatchProps {
  clearHandler(): void;
  createHandler(level: OlapLevel): void;
  removeHandler(item: DrilldownItem): void;
  toggleHandler(item: DrilldownItem): void;
  updateCaptionHandler(item: DrilldownItem, caption: string): void;
  updatePropertiesHandler(item: DrilldownItem, props: PropertyItem[]): void;
};

const QueryDrilldowns: React.FC<OwnProps & StateProps & DispatchProps> = props => {
  const { items } = props;
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

const mapState: MapStateToProps<StateProps, OwnProps, ExplorerState> = state => ({
  items: selectDrilldownItems(state)
});

const mapDispatch: MapDispatchToPropsFunction<DispatchProps, OwnProps> = dispatch => ({
  clearHandler() {
    dispatch(doDrilldownClear());
  },
  createHandler(level) {
    const drilldownItem = buildDrilldown(level);
    dispatch(doDrilldownUpdate(drilldownItem));
  },
  removeHandler(item) {
    dispatch(doDrilldownRemove(item.key));
  },
  toggleHandler(item) {
    dispatch(doDrilldownUpdate({ ...item, active: !item.active }));
  },
  updateCaptionHandler(item, caption) {
    dispatch(doDrilldownUpdate({...item, caption}));
  },
  updatePropertiesHandler(item, properties) {
    dispatch(doDrilldownUpdate({...item, properties}));
  }
});

export default connect(mapState, mapDispatch)(QueryDrilldowns);
