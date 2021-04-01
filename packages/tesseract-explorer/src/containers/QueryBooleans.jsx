import {ButtonGroup, Checkbox, ControlGroup, Divider, FormGroup, NumericInput} from "@blueprintjs/core";
import React, {memo, useMemo} from "react";
import {connect} from "react-redux";
import {QueryArea} from "../components/QueryArea";
import {SelectObject} from "../components/Select";
import SelectMeasure from "../containers/ConnectedSelectMeasure";
import {doBooleanToggle, doPaginationUpdate, doSortingUpdate} from "../state/params/actions";
import {selectBooleans, selectPaginationParams, selectSortingParams} from "../state/params/selectors";
import {selectServerBooleansEnabled} from "../state/server/selectors";
import {useTranslation} from "../utils/localization";
import {shallowEqualExceptFns, shallowEqualForProps} from "../utils/validation";

/** @type {React.FC<import("../components/Select").SelectObjectProps<{value: string, label: string}>>} */
const SelectDirection = memo(SelectObject, shallowEqualForProps("items", "selectedItem"));

/**
 * @typedef OwnProps
 * @property {string} [className]
 */

/**
 * @typedef StateProps
 * @property {boolean} [debug]
 * @property {boolean} [distinct]
 * @property {boolean} [exclude_default_members]
 * @property {number} limit
 * @property {boolean} [nonempty]
 * @property {number} offset
 * @property {boolean} [parents]
 * @property {string} sortDir
 * @property {string} sortKey
 * @property {boolean} [sparse]
 * @property {string[]} _enabledBooleans
 */

/**
 * @typedef DispatchProps
 * @property {() => any} toggleDebugHandler
 * @property {() => any} toggleDistinctHandler
 * @property {() => any} toggleExcludeDefaultMembersHandler
 * @property {() => any} toggleNonEmptyHandler
 * @property {() => any} toggleParentsHandler
 * @property {() => any} toggleSparseHandler
 * @property {(limit: number, offset: number) => any} updatePaginationHandler
 * @property {(sortKey: string, sortDir: string) => any} updateSortingHandler
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
export const QueryBooleans = props => {
  const {translate: t} = useTranslation();

  const sort = useMemo(() => {
    const directions = {
      asc: t("params.direction_asc"),
      desc: t("params.direction_desc")
    };
    const options = [
      {value: "asc", label: directions.asc},
      {value: "desc", label: directions.desc}
    ];
    return {directions, options};
  }, []);

  return (
    <QueryArea
      className={props.className}
      open={false}
      title={t("params.title_area_options")}
      tooltip={t("params.tooltip_area_options")}
    >
      {props._enabledBooleans.includes("debug") && <Checkbox
        className="item-option"
        label={t("params.label_boolean_debug")}
        checked={props.debug || false}
        onChange={props.toggleDebugHandler}
      />}
      {props._enabledBooleans.includes("distinct") && <Checkbox
        className="item-option"
        label={t("params.label_boolean_distinct")}
        checked={props.distinct || false}
        onChange={props.toggleDistinctHandler}
      />}
      {props._enabledBooleans.includes("exclude_default_members") && <Checkbox
        className="item-option"
        label={t("params.label_boolean_exclude_default_members")}
        checked={props.exclude_default_members || false}
        onChange={props.toggleExcludeDefaultMembersHandler}
      />}
      {props._enabledBooleans.includes("nonempty") && <Checkbox
        className="item-option"
        label={t("params.label_boolean_nonempty")}
        checked={props.nonempty || false}
        onChange={props.toggleNonEmptyHandler}
      />}
      {props._enabledBooleans.includes("parents") && <Checkbox
        className="item-option"
        label={t("params.label_boolean_parents")}
        checked={props.parents || false}
        onChange={props.toggleParentsHandler}
      />}
      {props._enabledBooleans.includes("sparse") && <Checkbox
        className="item-option"
        label={t("params.label_boolean_sparse")}
        checked={props.sparse || false}
        onChange={props.toggleSparseHandler}
      />}

      <FormGroup label={t("params.label_sorting_key")}>
        <ControlGroup fill={true}>
          <SelectMeasure
            fill={true}
            icon={props.sortKey ? "timeline-bar-chart" : false}
            selectedItem={props.sortKey}
            onItemSelect={measure => props.updateSortingHandler(measure.name, props.sortDir)}
          />
          <SelectDirection
            getLabel={item => item.label}
            items={sort.options}
            onItemSelect={direction => props.updateSortingHandler(props.sortKey, direction.value)}
            selectedItem={sort.directions[props.sortDir]}
          />
        </ControlGroup>
      </FormGroup>

      <ButtonGroup fill={true}>
        <FormGroup label={t("params.label_pagination_limit")}>
          <NumericInput
            fill={true}
            onValueChange={limit => props.updatePaginationHandler(limit, props.offset)}
            value={props.limit}
          />
        </FormGroup>

        <Divider />

        <FormGroup label={t("params.label_pagination_offset")}>
          <NumericInput
            fill={true}
            onValueChange={offset => props.updatePaginationHandler(props.limit, offset)}
            value={props.offset}
          />
        </FormGroup>
      </ButtonGroup>
    </QueryArea>
  );
};

export const MemoQueryBooleans = memo(QueryBooleans, shallowEqualExceptFns);

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  ...selectBooleans(state),
  ...selectPaginationParams(state),
  ...selectSortingParams(state),
  _enabledBooleans: selectServerBooleansEnabled(state)
});

/** @type {TessExpl.State.MapDispatchFn<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({
  toggleDebugHandler() {
    dispatch(doBooleanToggle("debug"));
  },
  toggleDistinctHandler() {
    dispatch(doBooleanToggle("distinct"));
  },
  toggleExcludeDefaultMembersHandler() {
    dispatch(doBooleanToggle("exclude_default_members"));
  },
  toggleNonEmptyHandler() {
    dispatch(doBooleanToggle("nonempty"));
  },
  toggleParentsHandler() {
    dispatch(doBooleanToggle("parents"));
  },
  toggleSparseHandler() {
    dispatch(doBooleanToggle("sparse"));
  },
  updatePaginationHandler(limit, offset) {
    dispatch(doPaginationUpdate(limit, offset));
  },
  updateSortingHandler(measure, direction) {
    dispatch(doSortingUpdate(measure, direction));
  }
});

export const ConnectedQueryBooleans = connect(mapState, mapDispatch)(MemoQueryBooleans);
