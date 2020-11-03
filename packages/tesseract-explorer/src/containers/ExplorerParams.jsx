import {ButtonGroup} from "@blueprintjs/core";
import React from "react";
import {connect} from "react-redux";
import {ExplorerColumn} from "../components/ExplorerColumn";
import {selectCurrentQueryItem} from "../state/queries/selectors";
import ButtonExecuteQuery from "./ButtonExecuteQuery";
import QueryBooleans from "./QueryBooleans";
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
 * @property {QueryItem} query
 */

/**
 * @typedef DispatchProps
 * @property {any} [any]
 */

/** @type {React.FC<OwnProps & StateProps & DispatchProps>} */
const ExplorerParams = props =>
  <ExplorerColumn className={props.className} title="Parameters">
    <ButtonGroup className="cube-locale" fill vertical>
      <SelectCube
        fill
        placeholderEmpty="Select cube..."
        placeholderLoading="Loading..."
      />
      <SelectLocale />
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

/** @type {import("react-redux").MapStateToProps<StateProps, OwnProps, ExplorerState>} */
const mapState = state => ({
  query: selectCurrentQueryItem(state)
});

/** @type {import("react-redux").MapDispatchToPropsFunction<DispatchProps, OwnProps>} */
const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(ExplorerParams);
