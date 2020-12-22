import {ButtonGroup} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {ExplorerColumn} from "../components/ExplorerColumn";
import {selectCurrentQueryItem} from "../state/queries/selectors";
import {selectLocaleOptions, selectOlapCubeKeys} from "../state/server/selectors";
import ButtonExecuteQuery from "./ButtonExecuteQuery";
import {ConnectedQueryBooleans as QueryBooleans} from "./QueryBooleans";
import QueryCuts from "./QueryCuts";
import QueryDrilldowns from "./QueryDrilldowns";
import QueryGrowth from "./QueryGrowth";
import QueryMeasures from "./QueryMeasures";
import QueryRca from "./QueryRca";
import QueryTopk from "./QueryTopk";
import {ConnectedSelectCube as SelectCube} from "./SelectCube";
import {ConnectedSelectLocale as SelectLocale} from "./SelectLocale";

/**
 * @typedef OwnProps
 * @property {string} className
 */

/**
 * @typedef StateProps
 * @property {boolean} isLocaleSelectEnabled
 * @property {boolean} isCubeSelectEnabled
 * @property {TessExpl.Struct.QueryItem} query
 */

/**
 * @typedef DispatchProps
 * @property {any} [any]
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const ExplorerParams = props =>
  <ExplorerColumn className={props.className} title="Query Setup">
    <ButtonGroup className="cube-locale" fill vertical>
      {props.isLocaleSelectEnabled && <SelectLocale />}
      {props.isCubeSelectEnabled && <SelectCube
        fill
        placeholderEmpty="Select cube..."
        placeholderLoading="Loading..."
      />}
    </ButtonGroup>

    <QueryMeasures />
    <QueryDrilldowns />
    <QueryCuts />
    <QueryGrowth />
    <QueryRca />
    <QueryTopk />
    <QueryBooleans />

    <ButtonGroup className="query-actions" fill>
      <ButtonExecuteQuery />
    </ButtonGroup>
  </ExplorerColumn>;

/** @type {TessExpl.State.MapStateFn<StateProps, OwnProps>} */
const mapState = state => ({
  isLocaleSelectEnabled: selectLocaleOptions(state).length > 1,
  isCubeSelectEnabled: selectOlapCubeKeys(state).length > 1,
  query: selectCurrentQueryItem(state)
});

export default connect(mapState)(ExplorerParams);
